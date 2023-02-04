import { Message } from "discord.js";
import ErisMessage from "eris-boreas/lib/src/interfaces/ErisMessage";
import Isla from "../Isla";

//@ts-expect-error - Mocking a class partially. If it breaks I'll add new methods.
export default class MockMessage extends Message implements ErisMessage {
  public eris: Isla;

  constructor(
    isla: Isla,
    content: string,
    _mockSend: (content: string) => void
  ) {
    if (!isla.bot.user) throw new Error("Bot user not found");

    const mockSend = (
      weirdObject: { options: { content: string }; content?: string } | string
    ) => {
      _mockSend(
        typeof weirdObject === "string"
          ? weirdObject
          : typeof weirdObject.content === "string"
          ? weirdObject.content
          : weirdObject.options.content
      );

      return Promise.resolve(this);
    };

    super(isla.bot, {
      attachments: [],
      author: {
        avatar: isla.bot.user.avatar,
        id: "123",
        username: isla.bot.user.username,
        discriminator: isla.bot.user.discriminator,
      },
      channel_id: "123",
      content,
      edited_timestamp: null,
      embeds: [],
      id: Math.floor(Math.random() * 100000000000000000).toString(),
      mention_everyone: false,
      mention_roles: [],
      mentions: [],
      pinned: false,
      timestamp: new Date().toISOString(),
      tts: false,
      type: 0,
    });
    this.eris = isla;

    if (!this.channel) {
      Object.defineProperty(this, "channel", {
        value: {
          send: mockSend,
          id: "123",
          name: "mockChannel",
        },
      });
    }

    //@ts-expect-error - we are overriding the send method
    this.send = mockSend;
    this.reply = mockSend;
  }
}
