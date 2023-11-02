import Mood from "../mood/Moods";

const cwd = process.cwd();

const moodToImage: { [mood in Mood]: string } = {
  [Mood.IslaAsleep]: `${cwd}/assets/asleep.png`,
  [Mood.IslaExhausted]: `${cwd}/assets/exhausted.png`,
  [Mood.IslaFrustrated]: `${cwd}/assets/frustrated.png`,
  [Mood.IslaFocused]: `${cwd}/assets/frustrated.png`,
  [Mood.Bt7274]: `${cwd}/assets/happy.png`,
};

export function getImageFromMood(mood: Mood) {
  return moodToImage[mood];
}
