import MoodManager from "./mood/MoodManager";

export default class Isla {
  private static _instance: Isla;

  public moodManager: MoodManager;

  private constructor() {
    this.moodManager = new MoodManager(this);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
