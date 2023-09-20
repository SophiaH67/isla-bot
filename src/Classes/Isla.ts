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
import UnexpectedRestartService from "../Services/UnexpectedRestartService";

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
    this.services = [];
    this.registerServices();

    process.on("uncaughtException", this.onError.bind(this));
    process.on("unhandledRejection", this.onError.bind(this));
  }

  private onError(error: Error) {
    try {
      const logger = this.getService(LoggingService).getLogger("Isla");
      logger.error("An uncaught exception occurred");
      logger.debug(error.stack ?? error.message ?? "No stack trace available");
    } catch (_) {
      console.error(
        "An error occurred during either initialization or logging"
      );
      console.error(error);
    }
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

  private registerServices(): void {
    this.registerService(new MqttService());
    this.registerService(new LoggingService());
    this.registerService(new ProtocolService());
    this.registerService(new UnexpectedRestartService());
    this.registerService(new PrismaService());
    this.registerService(new MessageLoggerService());
    this.registerService(new RssService());
    this.registerService(new CommandService());
    this.registerService(new ConversationManagerService());
    this.registerService(new TwitterEmbedService());
    this.registerService(new MessageActionService());
    // Frontends
    this.registerService(new DiscordFrontend(this));
    this.registerService(new CLIFrontend(this));
    this.registerService(new JoinFrontend());
    this.registerService(new WebsocketFrontend(this));
    this.registerService(new HttpFrontend(this));
    this.registerService(new HomeAssistantFrontend());
    this.registerService(new MatrixFrontend(this));
  }

  private registerService(service: BaseService): void {
    this.services.push(service);
  }
}
