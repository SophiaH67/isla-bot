import BaseFrontend from "./Frontends/BaseFrontend";
import MoodManager from "./mood/MoodManager";

export default class Isla {
  private static _instance: Isla;

  public frontends: BaseFrontend[] = [];
  public moodManager: MoodManager;

  private constructor() {
    this.moodManager = new MoodManager(this);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async broadcast(message: string) {
    await Promise.all(
      this.frontends.map((frontend) => frontend.broadcast(message))
    );
  }
}
