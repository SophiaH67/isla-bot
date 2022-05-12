export default abstract class BaseFrontend {
  public abstract broadcast(message: string): Promise<void>;
}
