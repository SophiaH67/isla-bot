import Mood from "../Moods";

export interface EmotionState {
  exhaustion: number;
  frustration: number;
  focus: number;
}

export abstract class BaseState {
  public async init() {}

  /**
   * @returns EmotionDiff | typeof BaseState
   *
   * If the state is to be changed, return the new state.
   * Otherwise, return an EmotionState.
   *
   * If the state is to be changed, return BaseState.
   *
   * This function is called every emotion tick, which is defined in the MoodManager.
   */
  public abstract tick(
    emotion: EmotionState
  ): Promise<EmotionState | typeof BaseState>;

  public abstract getMood(emotion: EmotionState): Mood;
}
