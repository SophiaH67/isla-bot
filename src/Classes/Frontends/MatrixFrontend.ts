import BaseFrontend from "./BaseFrontend";
import {
  MatrixAuth,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  MatrixClient,
} from "matrix-bot-sdk";
import assert from "assert";
import { MatrixChatEvent, MatrixEvent } from "../Utils/MatrixEvent";
import MockMessage from "../Utils/MockMessage";
import Isla from "../Isla";
import { readFile } from "fs/promises";
import Mood from "../mood/Moods";
import { createHash } from "crypto";
import { getImageFromMood } from "../Utils/moodToImage";

export default class MatrixFrontend extends BaseFrontend {
  private storage = new SimpleFsStorageProvider("isla-matrix.json");
  private client!: MatrixClient;

  constructor(private readonly isla: Isla) {
    super();
  }

  public async start() {
    const accessToken = await this.getAccessToken();

    this.client = new MatrixClient(
      process.env.MATRIX_HOMESERVER as string, // To get to this point, we must have a MATRIX_HOMESERVER
      accessToken,
      this.storage
    );
    AutojoinRoomsMixin.setupOnClient(this.client);
    this.client.on("room.event", this.handleEvent.bind(this));

    await this.client.start();
  }

  public async handleEvent(roomId: string, event: MatrixEvent) {
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

  public async handleMessage(roomId: string, event: MatrixChatEvent) {
    const reply = (message: string) => {
      this.client.sendNotice(roomId, message);
    };

    const message = new MockMessage(this.isla, event.content.body, reply);
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
  public async onMoodChange(mood: Mood): Promise<void> {
    const pfp = getImageFromMood(mood);

    const matrixUpload = await this.uploadFileCached(pfp);

    await this.client.setAvatarUrl(matrixUpload);
  }
}
