import Mood from "../mood/Moods";
import Protocol from "../protocol/Protocol";

export default abstract class BaseFrontend {
  public async broadcast(_message: string): Promise<void> {}
  public async start(): Promise<void> {}
  public async setProtocol(_protocol: Protocol): Promise<void> {}
  public async onMoodChange(_mood: Mood): Promise<void> {}
}
