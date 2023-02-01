import { Message } from "discord.js";
import ErisMessage from "eris-boreas/lib/src/interfaces/ErisMessage";
import Isla from "../Isla";

const mockSend = (content: string) =>
  //@ts-expect-error - For some reason, the message content is in a property called options
  console.log(`[MockMessage] ${content.options.content}`);

//@ts-expect-error - Mocking a class partially. If it breaks I'll add new methods.
export default class MockMessage extends Message implements ErisMessage {
  public eris: Isla;

  constructor(isla: Isla, content: string) {
    if (!isla.bot.user) throw new Error("Bot user not found");

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
  }
}
