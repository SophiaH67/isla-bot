import Mood from "../Moods";
import { IslaAsleepDictionary } from "./IslaAsleepDictionary";
import { Bt7274Dictionary } from "./Bt7274Dictionary";
import { IslaExhaustedDictionary } from "./IslaExhaustedDictionary";
import { IslaFocusedDictionary } from "./IslaFocusedDictionary";
import { IslaFrustratedDictionary } from "./IslaFrustratedDictionary";
import Conversation from "../../Utils/Conversation";
import { MoodManagerService } from "../MoodManager";

export type TranslationDictionary = typeof Bt7274Dictionary;

export const MoodMap: Record<Mood, TranslationDictionary> = {
  [Mood.IslaAsleep]: IslaAsleepDictionary,
  [Mood.IslaExhausted]: IslaExhaustedDictionary,
  [Mood.IslaFocused]: IslaFocusedDictionary,
  [Mood.IslaFrustrated]: IslaFrustratedDictionary,
  [Mood.Bt7274]: Bt7274Dictionary,
};

export function t(
  conversation: Conversation,
  key: keyof TranslationDictionary
) {
  const moodManager = conversation.isla.getService(MoodManagerService);
  const mood = moodManager.mood;
  const dictionary = MoodMap[mood];
  return dictionary[key];
}
