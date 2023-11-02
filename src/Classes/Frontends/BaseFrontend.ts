import { BaseService } from "../../Services/BaseService";

export default abstract class BaseFrontend implements BaseService {
  public async broadcast(_message: string): Promise<void> {}
  public async onStart(): Promise<void> {}
  public async sendMessage(
    _channelId: string,
    _message: string
  ): Promise<void> {}
}
