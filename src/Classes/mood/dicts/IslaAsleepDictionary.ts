import { TranslationDictionary } from ".";
import { IslaExhaustedDictionary } from "./IslaExhaustedDictionary";

function deepCloneAndSet<T extends Record<string, unknown>>(
  obj: T,
  value: string
): T {
  const clone = JSON.parse(JSON.stringify(obj));
  for (const key in clone) {
    const val = clone[key];

    if (typeof val === "object") {
      deepCloneAndSet(val, value);
    }

    if (typeof val === "string") {
      clone[key] = value;
    }
  }
  return clone;
}

export const IslaAsleepDictionary: TranslationDictionary = {
  ...deepCloneAndSet(IslaExhaustedDictionary, "zzz"),
  wakeUpCommand: "Why did you wake me up,,,",
};
