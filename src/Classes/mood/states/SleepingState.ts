import { BaseState, EmotionState } from "./BaseState";

export class SleepingState extends BaseState {
  public name = "sleeping";
  private startedSleepingAt: Date = new Date();

  /**
   * @returns 0-1
   *
   * 0 is the start of the sleep, 1 is the end of the sleep.
   */
  private get maxSleepProgress(): number {
    const offset = this.startedSleepingAt.getTime();

    const max = 12 * 60 * 60 * 1000; // 12 hours

    const now = new Date().getTime();

    return (now - offset) / max;
  }

  public async init(): Promise<void> {
    this.startedSleepingAt = new Date();
  }

  async tick(_emotion: EmotionState): Promise<typeof BaseState | EmotionState> {
    // Check if we should wake up
    const wakeup = this.shouldWakeUp(this.maxSleepProgress);
    if (wakeup) {
      return BaseState; // @todo: write awake state
    }

    // Generate an emotion diff
    const emotionDiff = this.generateEmotionState(this.maxSleepProgress);

    return emotionDiff;
  }

  private shouldWakeUp(maxSleepProgress: number): boolean {
    // Map it to a x^4 curve
    const chanceToWakeUp = Math.pow(maxSleepProgress, 4); // (1 will always return 1, which is the cap)

    // Generate a random number between 0 and 1, divide it by 30. Ticks are every 1 minute, so this
    // means it's practically the same as only checking every 30 minutes.
    const random = Math.random() / 30;

    const inverted = 1 - random;

    return chanceToWakeUp > inverted;
  }

  private generateEmotionState(maxSleepProgress: number): EmotionState {
    const exhaustion = this.interpolate(
      maxSleepProgress,
      [0.8, 1, 0.4, 0.3, 0, 0.2, 0.4]
    );
    const frustration = this.interpolate(
      maxSleepProgress,
      [0.3, 0.3, 0.3, 0.1, 0.3, 0.6, 0.8]
    );
    const focus = this.interpolate(
      maxSleepProgress,
      [0.2, 0.8, 0.2, 0.6, 0.7, 0.5, 0.1]
    );

    return {
      exhaustion,
      frustration,
      focus,
    };
  }

  private interpolate(
    maxSleepProgress: number,
    values: [number, number, number, number, number, number, number]
  ): number {
    const index = Math.floor(maxSleepProgress * values.length);

    const value = values[index];

    return value;
  }
}
