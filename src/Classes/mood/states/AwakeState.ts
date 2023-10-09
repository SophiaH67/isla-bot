import Mood from "../Moods";
import { BaseState, EmotionState } from "./BaseState";
import { SleepingState } from "./SleepingState";

export class AwakeState extends BaseState {
  public async tick(
    emotion: EmotionState
  ): Promise<typeof BaseState | EmotionState> {
    // Check if we should sleep
    if (emotion.exhaustion > 0.95) {
      return SleepingState;
    }

    // Generate some random changes
    return {
      exhaustion: emotion.exhaustion + this.generateExhaustionModifier(),
      frustration: emotion.frustration + this.generateGenericModifier(),
      focus: emotion.focus + this.generateGenericModifier(),
    };
  }

  private generateExhaustionModifier(): number {
    // We want to stay awake for anywhere between 4 and 30 hours. With a tick every minute, that's
    // between 240 and 1800 ticks. At exhaustion of 1 we will go to sleep, so we need to add between
    // (1 / 240) and (1 / 1800) to the exhaustion every tick.
    const modifier = 1 / (Math.random() * (1800 - 240) + 240);

    return modifier;
  }

  private generateGenericModifier(): number {
    // Generate a random number between -0.1 and 0.1
    const modifier = Math.random() * 0.2 - 0.1;

    return modifier;
  }

  public getMood(emotion: EmotionState): Mood {
    // Get which mood is the highest
    const keys = Object.keys(emotion) as (keyof EmotionState)[];
    // Find the highest value
    const highest = keys.reduce((prev, curr) =>
      emotion[prev] > emotion[curr] ? prev : curr
    );

    switch (highest) {
      case "exhaustion":
        return Mood.IslaExhausted;

      case "frustration":
        return Mood.IslaFrustrated;

      case "focus":
        return Mood.IslaFocused;
    }
  }
}
