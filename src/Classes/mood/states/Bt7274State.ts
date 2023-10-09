import Mood from "../Moods";
import { BaseState, EmotionState } from "./BaseState";

/**
 * BT-7274 is a Vanguard-class Titan. BT does not feel any emotions, and is used in dire
 * situations where protocol > 1.
 */
export class Bt7274State extends BaseState {
  public async tick(
    _emotion: EmotionState
  ): Promise<typeof BaseState | EmotionState> {
    return {
      exhaustion: 0,
      frustration: 0,
      focus: 1,
    };
  }

  public getMood(_emotion: EmotionState): Mood {
    return Mood.Bt7274;
  }
}
