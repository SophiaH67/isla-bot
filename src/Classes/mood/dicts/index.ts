import Mood from "../Moods";
import { IslaAsleepDictionary } from "./IslaAsleepDictionary";
import { Bt7274Dictionary } from "./Bt7274Dictionary";
import { IslaExhaustedDictionary } from "./IslaExhaustedDictionary";
import { IslaFocusedDictionary } from "./IslaFocusedDictionary";
import { IslaFrustratedDictionary } from "./IslaFrustratedDictionary";

export type TranslationDictionary = typeof Bt7274Dictionary;

export const MoodMap: Record<Mood, TranslationDictionary> = {
  [Mood.IslaAsleep]: IslaAsleepDictionary,
  [Mood.IslaExhausted]: IslaExhaustedDictionary,
  [Mood.IslaFocused]: IslaFocusedDictionary,
  [Mood.IslaFrustrated]: IslaFrustratedDictionary,
  [Mood.Bt7274]: Bt7274Dictionary,
};
