import { BaseService } from "../../Services/BaseService";
import Mood from "./Moods";
import { BaseState, EmotionState } from "./states/BaseState";
import { AwakeState } from "./states/AwakeState";

export class MoodManagerService implements BaseService {
  private tickDelay = 60_000;

  private moodState: BaseState = new AwakeState();

  constructor() {}

  // Actual mood factors
  private _moodInfo: EmotionState = {
    exhaustion: 0.5,
    frustration: 0.5,
    focus: 0.5,
  };

  private set moodInfo(value: EmotionState) {
    this._moodInfo = value;
  }

  public get moodInfo(): EmotionState {
    return this._moodInfo;
  }

  async onStart(): Promise<void> {
    this.tick();
    setInterval(() => this.tick(), this.tickDelay);
  }

  private async tick(): Promise<void> {
    const newMood = await this.moodState.tick(this.moodInfo);

    // Check if it's a class (not instance)
    if ("prototype" in newMood) {
      return await this.switchState(newMood);
    }

    // Cap the values
    newMood.exhaustion = Math.min(1, Math.max(0, newMood.exhaustion));
    newMood.frustration = Math.min(1, Math.max(0, newMood.frustration));
    newMood.focus = Math.min(1, Math.max(0, newMood.focus));

    this.moodInfo = newMood;
  }

  public get mood(): Mood {
    return this.moodState.getMood(this.moodInfo);
  }

  public async switchState(state: typeof BaseState): Promise<void> {
    // Verify that the state is a subclass of BaseState
    if (!isSubclassOf(state, BaseState)) throw new Error("Invalid state");

    const moodState = new (state as new () => BaseState)();
    if (typeof moodState.tick !== "function")
      throw new Error("Missing tick function on " + state.name);
    this.moodState = moodState;
    await this.moodState.init();
    await this.tick();
  }
}

function isSubclassOf(child: any, parent: any): boolean {
  if (child === parent) return true;

  const proto = Object.getPrototypeOf(child);

  if (proto === null) return false;

  return isSubclassOf(proto, parent);
}
