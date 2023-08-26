import { BaseService } from "../../Services/BaseService";
import Isla from "../Isla";

export default abstract class BaseFrontend extends BaseService {
  public async broadcast(_message: string): Promise<void> {}
  public async start(): Promise<void> {}
  public async sendMessage(
    _channelId: string,
    _message: string
  ): Promise<void> {}

  public async onReady(_isla: Isla): Promise<void> {
    await this.start();
  }
}
