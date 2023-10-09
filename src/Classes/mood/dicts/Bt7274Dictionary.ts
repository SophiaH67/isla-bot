/**
 * @class Bt7274Dictionary
 *
 * Since BT7274 does not have an emotion controller, it is used
 * as a reference for other dictionaries.
 */
export const Bt7274Dictionary = {
  lightStateUnknown: "Negative. Unknown light state.",
  lightStateChangeOn: "Roger. Lights are now on.",
  lightStateChangeOff: "Affirmative. Lights are now off.",
  lightStateChangeError:
    "Negative. There was an error while changing the lights.",
  unknownEvalError: "Unknown evaluation error within the given script.",
  wakeUpCommand: "Negative. Vanguard class Titans are not capable of sleeping.",
};
