import Protocol from "../protocol/Protocol";

export default abstract class BaseFrontend {
  public async broadcast(message: string): Promise<void> {}
  public async start(): Promise<void> {}
  public async setProtocol(_protocol: Protocol): Promise<void> {}
}
