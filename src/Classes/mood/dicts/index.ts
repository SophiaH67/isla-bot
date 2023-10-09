import Mood from "../Moods";
import { AsleepDictionary } from "./AsleepDictionary";
import { Bt7274Dictionary } from "./Bt7274Dictionary";
import { ExhaustedDictionary } from "./ExhaustedDictionary";
import { FocusedDictionary } from "./FocusedDictionary";
import { FrustratedDictionary } from "./FrustratedDictionary";

export type TranslationDictionary = typeof Bt7274Dictionary;

export const MoodMap: Record<Mood, TranslationDictionary> = {
  [Mood.Asleep]: AsleepDictionary,
  [Mood.Exhausted]: ExhaustedDictionary,
  [Mood.Focused]: FocusedDictionary,
  [Mood.Frustrated]: FrustratedDictionary,
  [Mood.Bt7274]: Bt7274Dictionary,
};
