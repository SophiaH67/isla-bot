import Mood from "../mood/Moods";

const cwd = process.cwd();

const moodToImage: { [mood in Mood]: string } = {
  [Mood.Asleep]: `${cwd}/assets/asleep.png`,
  [Mood.Bored]: `${cwd}/assets/bored.png`,
  [Mood.Curious]: `${cwd}/assets/curious.png`,
  [Mood.Exhausted]: `${cwd}/assets/exhausted.png`,
  [Mood.Frustrated]: `${cwd}/assets/frustrated.png`,
  [Mood.Happy]: `${cwd}/assets/happy.png`,
};

export function getImageFromMood(mood: Mood) {
  return moodToImage[mood];
}
