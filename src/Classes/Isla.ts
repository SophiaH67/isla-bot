import assert from "assert";
import BaseFrontend from "./Frontends/BaseFrontend";
import MoodManager from "./mood/MoodManager";
import { createClient } from "redis";
import DirectiveHandler from "./Utils/DirectiveHandler";
import ConversationManagerService from "../Services/ConversationManagerService";
import { IslaMessage } from "./interfaces/IslaMessage";
import { BaseService } from "../Services/BaseService";
import DiscordFrontend from "./Frontends/DiscordFrontend";
import CLIFrontend from "./Frontends/CLIFrontend";
import JoinFrontend from "./Frontends/JoinFrontend";
import WebsocketFrontend from "./Frontends/WebsocketFrontend";
import HttpFrontend from "./Frontends/HttpFrontend";
import HomeAssistantFrontend from "./Frontends/HomeAssistantFrontend";
import MatrixFrontend from "./Frontends/MatrixFrontend";
import CommandService from "../Services/CommandService";
import TwitterEmbedService from "../Services/TwitterEmbedService";
import { PrismaService } from "../Services/PrismaService";
import { RssService } from "../Services/RssService";
import { IslaChannel } from "./interfaces/IslaChannel";
import { MessageActionService } from "../Services/MessageActionService";
import { MessageLoggerService } from "../Services/MessageLoggerService";
import MqttService from "../Services/MqttService";
import LoggingService from "../Services/LoggingService";
import ProtocolService from "../Services/ProtocolService";

export default class Isla {
  public redis = createClient({
    url: process.env.REDIS_HOST
      ? `redis://${process.env.REDIS_HOST}`
      : "redis://localhost",
  });
  public directiveHandler = new DirectiveHandler(this);

  private services: BaseService[];
  public moodManager: MoodManager;

  public async transformMessage(message: string): Promise<string>;
  public async transformMessage(message: undefined): Promise<undefined>;
  public async transformMessage(
    message: string | undefined
  ): Promise<string | undefined>;
  public async transformMessage(message: string | undefined) {
    if (!message) {
      return undefined;
    }
    return await this.moodManager
      .transformMessage(message)
      .catch(() => message);
  }

  constructor() {
    this.moodManager = new MoodManager(this);

    assert(process.env.DISCORD_TOKEN, "DISCORD_TOKEN is not set");

    // Load services
    this.services = [
      new MqttService(),
      new LoggingService(),
      new ProtocolService(),
      new PrismaService(),
      new MessageLoggerService(),
      new RssService(),
      new CommandService(),
      new ConversationManagerService(),
      new TwitterEmbedService(),
      new MessageActionService(),

      // Frontends
      new DiscordFrontend(this),
      new CLIFrontend(this),
      new JoinFrontend(),
      new WebsocketFrontend(this),
      new HttpFrontend(this),
      new HomeAssistantFrontend(),
      new MatrixFrontend(this),
    ];
  }

  public async start(): Promise<void> {
    console.log("Nya~");
    await this.redis.connect();
    const ping = await this.redis.ping();
    console.log(`${Isla.name} is ready!, database ping: ${ping}`);

    // Start services
    await Promise.all(this.services.map((service) => service.onReady?.(this)));
  }

  async onMessage(msg: IslaMessage) {
    this.services.forEach((service) => service.onMessage?.(msg));
  }

  async onMessageUpdate(msg: IslaMessage) {
    this.services.forEach((service) => service.onMessageUpdate?.(msg));
  }

  public getService<T extends BaseService>(
    service: string | (new () => T) | (new (isla: Isla) => T)
  ): T {
    const serviceName = typeof service === "string" ? service : service.name;
    const serviceInstance = this.services.find(
      (service) =>
        service.constructor.name.toLowerCase() === serviceName.toLowerCase()
    );

    if (!serviceInstance) {
      throw new Error(`Service ${serviceName} not found`);
    }

    return serviceInstance as T;
  }

  public getFrontend(frontendName: string): BaseFrontend {
    const service = this.getService(frontendName);

    // Check if service is a frontend
    if (!(service instanceof BaseFrontend)) {
      throw new Error(`${frontendName} is not a frontend`);
    }

    return service;
  }

  public getChannel(frontendName: string, channelId: string): IslaChannel {
    const frontend = this.getFrontend(frontendName);
    return new IslaChannel(channelId, frontend);
  }

  public async sendMessage(
    channel: IslaChannel,
    message: string
  ): Promise<void> {
    await channel.frontend.sendMessage(channel.id, message);
  }
}
