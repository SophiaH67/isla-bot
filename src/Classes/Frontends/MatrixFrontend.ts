import BaseFrontend from "./BaseFrontend";
import {
  MatrixAuth,
  SimpleFsStorageProvider,
  MatrixClient,
  RustSdkCryptoStorageProvider,
} from "matrix-bot-sdk";
import assert from "assert";
import { MatrixChatEvent, MatrixEvent } from "../Utils/MatrixEvent";
import Isla from "../Isla";
import { readFile } from "fs/promises";
import Mood from "../mood/Moods";
import { createHash } from "crypto";
import { getImageFromMood } from "../Utils/moodToImage";
import { IslaMessage, ReplyOptions } from "../interfaces/IslaMessage";
import { IslaUser } from "../interfaces/IslaUser";
import { fromBuffer } from "file-type";
import sharp from "sharp";
import { marked } from "marked";

const fetchToBuffer = async (url: string) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

export default class MatrixFrontend extends BaseFrontend {
  private storage = new SimpleFsStorageProvider("data/isla-matrix.json");
  private crypto = new RustSdkCryptoStorageProvider("data/crypto");
  private client: MatrixClient | undefined;

  private currentMoodProfile: Mood = Mood.Frustrated;

  constructor(private readonly isla: Isla) {
    super();
  }

  public async start() {
    const accessToken = await this.getAccessToken();

    this.client = new MatrixClient(
      process.env.MATRIX_HOMESERVER as string, // To get to this point, we must have a MATRIX_HOMESERVER
      accessToken,
      this.storage,
      this.crypto
    );

    await this.client.crypto.prepare(await this.client.getJoinedRooms());

    this.client.on("room.event", this.handleEvent.bind(this));
    // On invite
    this.client.on("room.invite", (roomId, _inviteEvent) => {
      console.log("Got invite to room", roomId);
      this.client?.joinRoom(roomId);
    });

    await this.client.start();

    const matrixUser = await this.client.getUserProfile(
      await this.client.getUserId()
    );

    if (matrixUser.displayname != this.isla.constructor.name)
      await this.client.setDisplayName(this.isla.constructor.name);
  }

  public async handleEvent(roomId: string, event: MatrixEvent) {
    if (!this.client) return; // Will never happen, but keep ts happy

    // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
    if (!("content" in event)) return;
    if (event["sender"] === (await this.client.getUserId())) return; // Ignore our own messages

    // Figure out what type of event it is
    switch (event["type"]) {
      case "m.room.message":
        await this.handleMessage(roomId, event);
        break;
      case "m.room.member":
        console.debug(
          "Member event",
          event.content.membership,
          event.content.displayname,
          event.content.avatar_url
        );
        break;
    }
  }

  private async messageEventToIslaMessage(
    roomId: string,
    event: MatrixChatEvent
  ): Promise<IslaMessage> {
    const reply = async (message: string, options: ReplyOptions = {}) => {
      const threadId =
        (event.content["m.relates_to"]?.rel_type === "m.thread" &&
          event.content["m.relates_to"]?.event_id) ||
        (options.forceThread && event.event_id);

      const platformNativeReply = options.platformNativeReply ?? true;

      const eventId = await this.client?.sendMessage?.(roomId, {
        msgtype: "m.text",
        body: message,
        format: "org.matrix.custom.html",
        formatted_body: marked.parse(message),
        "m.relates_to": {
          ...(platformNativeReply && {
            "m.in_reply_to": {
              event_id: event.event_id,
            },
          }),
          ...(threadId && {
            rel_type: "m.thread",
            event_id: threadId,
          }),
        },
      });

      if (!eventId) throw new Error("Failed to send message");

      for (const media of options.media || []) {
        const buffer =
          typeof media === "string" ? await fetchToBuffer(media) : media;

        const fileType = await fromBuffer(buffer);

        if (!fileType) throw new Error("Failed to get file type");

        if (!fileType.mime.startsWith("image/"))
          throw new Error("File type is not an image");

        const imageDetails = await sharp(buffer).metadata();

        const encrypted = await this.client?.crypto.encryptMedia(buffer);
        if (!encrypted) throw new Error("Failed to encrypt media");

        const hash = createHash("sha256").update(buffer).digest("hex");
        const filename = hash + "." + fileType.ext;

        const mxc = await this.client?.uploadContent(
          encrypted.buffer,
          fileType.mime,
          filename
        );

        if (!mxc) throw new Error("Failed to upload media");

        await this.client?.sendMessage(roomId, {
          msgtype: "m.image",
          body: filename,
          info: {
            w: imageDetails.width,
            h: imageDetails.height,
            mimetype: fileType.mime,
            size: buffer.length,
          },
          file: {
            url: mxc,
            ...encrypted.file,
          },

          ...(threadId && {
            "m.relates_to": {
              rel_type: "m.thread",
              event_id: threadId,
            },
          }),
        });
      }

      const chatEvent = await this.client?.getEvent(roomId, eventId);

      if (!chatEvent) throw new Error("Failed to get event");

      return this.messageEventToIslaMessage(roomId, chatEvent);
    };

    const user = await this.client?.getUserProfile(event.sender);

    const author = new IslaUser(event.sender, user?.displayname || "Unknown");

    const replyId: string | undefined =
      "event_id" in (event.content?.["m.relates_to"]?.["m.in_reply_to"] || {})
        ? event.content?.["m.relates_to"]?.["m.in_reply_to"]?.event_id
        : undefined;

    const message = new IslaMessage(
      this.isla,
      event.content.body,
      reply,
      author,
      event.event_id,
      replyId ? { id: replyId } : undefined
    );

    return message;
  }

  public async handleMessage(roomId: string, event: MatrixChatEvent) {
    if (this.isla.moodManager.mood !== this.currentMoodProfile)
      await this.updateProfileToMatchMood();

    const message = await this.messageEventToIslaMessage(roomId, event);

    await this.isla.onMessage(message);
  }

  private async getAccessToken(): Promise<string> {
    const accessToken = await this.getAccessTokenFromStorage()
      .catch(() => this.login())
      .catch(() => this.register())
      .catch((e) => {
        console.error(e);
        throw new Error("Failed to login or register with Matrix");
      })
      .then((accessToken) => this.storeAccessToken(accessToken));

    return accessToken;
  }

  private async getAccessTokenFromStorage(): Promise<string> {
    const accessToken = await this.isla.redis.get("matrix_access_token");

    if (!accessToken) throw new Error("No access token found in storage");

    return accessToken;
  }

  private async storeAccessToken(accessToken: string) {
    await this.isla.redis.set("matrix_access_token", accessToken);

    return accessToken;
  }

  private async login(): Promise<string> {
    assert(process.env.MATRIX_USERNAME, "MATRIX_USERNAME is not set");
    assert(process.env.MATRIX_PASSWORD, "MATRIX_PASSWORD is not set");
    assert(process.env.MATRIX_HOMESERVER, "MATRIX_HOMESERVER is not set");

    const auth = new MatrixAuth(process.env.MATRIX_HOMESERVER);
    const login = await auth.passwordLogin(
      process.env.MATRIX_USERNAME,
      process.env.MATRIX_PASSWORD
    );

    return login.accessToken;
  }

  private async register(): Promise<string> {
    assert(process.env.MATRIX_USERNAME, "MATRIX_USERNAME is not set");
    assert(process.env.MATRIX_PASSWORD, "MATRIX_PASSWORD is not set");
    assert(process.env.MATRIX_HOMESERVER, "MATRIX_HOMESERVER is not set");

    const auth = new MatrixAuth(process.env.MATRIX_HOMESERVER);
    const register = await auth.passwordRegister(
      process.env.MATRIX_USERNAME,
      process.env.MATRIX_PASSWORD
    );

    return register.accessToken;
  }

  private async uploadFileCached(path: string) {
    if (!this.client) throw new Error("Matrix client not initialised");
    const pathHash = createHash("md5").update(path).digest("hex");
    const redisKey = `matrix:cache:${pathHash}`;
    const existingFile = await this.isla.redis.get(redisKey);

    if (existingFile) {
      // Check if it still exists on matrix side
      try {
        await this.client.downloadContent(existingFile);
        return existingFile;
      } catch (e) {
        // Doesn't exist, so we'll upload it again
      }
    }

    const newMatrixFile = await this.client.uploadContent(await readFile(path));

    await this.isla.redis.set(redisKey, newMatrixFile);

    return newMatrixFile;
  }

  private async updateProfileToMatchMood() {
    if (!this.client) return;
    if (Math.random() !== 2) return; // Will always return, but now TS won't nag me
    const pfp = getImageFromMood(this.isla.moodManager.mood);

    const matrixUpload = await this.uploadFileCached(pfp);

    await this.client.setAvatarUrl(matrixUpload);

    this.currentMoodProfile = this.isla.moodManager.mood;
  }
}
