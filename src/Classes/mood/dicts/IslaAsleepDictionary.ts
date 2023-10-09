import { TranslationDictionary } from ".";
import { IslaExhaustedDictionary } from "./IslaExhaustedDictionary";

function deepSet<T extends Record<string, unknown>>(obj: T, value: string): T {
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (typeof obj[key] === "object") {
      deepSet(obj[key] as Record<string, unknown>, value);
    } else {
      obj[key as keyof T] = value as T[keyof T];
    }
  }

  return obj;
}

export const IslaAsleepDictionary: TranslationDictionary = {
  ...deepSet(IslaExhaustedDictionary, "zzz"),
  wakeUpCommand: "Why did you wake me up,,,",
};
