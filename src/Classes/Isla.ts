import assert from "assert";
import BaseFrontend from "./Frontends/BaseFrontend";
import MoodManager from "./mood/MoodManager";
import ProtocolManager from "./protocol/ProtocolManager";
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

export default class Isla {
  public redis = createClient({
    url: process.env.REDIS_HOST
      ? `redis://${process.env.REDIS_HOST}`
      : "redis://localhost",
  });
  public conversationManager = new ConversationManagerService();
  public directiveHandler = new DirectiveHandler(this);

  public frontends: BaseFrontend[] = [];
  private services: BaseService[] = [];
  public moodManager: MoodManager;
  public protocolManager: ProtocolManager;

  public async transformMessage(message: string): Promise<string>;
  public async transformMessage(message: undefined): Promise<undefined>;
  public async transformMessage(
    message: string | undefined
  ): Promise<string | undefined>;
  public async transformMessage(message: string | undefined) {
    if (!message) {
      return undefined;
    }
    return await this.moodManager.transformMessage(message);
  }

  constructor() {
    this.moodManager = new MoodManager(this);
    this.protocolManager = new ProtocolManager(this);

    assert(process.env.DISCORD_TOKEN, "DISCORD_TOKEN is not set");

    // Load frontends
    this.frontends.push(new DiscordFrontend(this));
    this.frontends.push(new CLIFrontend(this));
    this.frontends.push(new JoinFrontend(this));
    this.frontends.push(new WebsocketFrontend(this));
    this.frontends.push(new HttpFrontend(this));
    this.frontends.push(new HomeAssistantFrontend());
    this.frontends.push(new MatrixFrontend(this));

    // Load services
    this.services.push(new CommandService());
    this.services.push(new ConversationManagerService());
  }

  public async broadcast(message: string) {
    await Promise.all(
      this.frontends.map((frontend) => frontend.broadcast(message))
    );
  }

  public async start(): Promise<void> {
    console.log("Nya~");
    await this.redis.connect();
    const ping = await this.redis.ping();
    console.log(`${Isla.name} is ready!, database ping: ${ping}`);

    // Start services
    await Promise.all(this.services.map((service) => service.onReady?.(this)));

    this.frontends.forEach((frontend) => frontend.start());
  }

  async onMessage(msg: IslaMessage) {
    this.services.forEach((service) => service.onMessage?.(msg));
  }

  public getService<T extends BaseService>(service: string | (new () => T)): T {
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
}
