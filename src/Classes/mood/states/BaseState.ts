export interface EmotionState {
  exhaustion: number;
  frustration: number;
  focus: number;
}

export abstract class BaseState {
  public abstract name: string;

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
}
