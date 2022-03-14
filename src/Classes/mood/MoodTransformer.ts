import MoodManager from "./MoodManager";
import { Configuration, OpenAIApi } from "openai";
import Mood from "./Moods";

export default class MoodTransformer {
  private config: Configuration = new Configuration({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });
  private openAI: OpenAIApi = new OpenAIApi(this.config);
  //@ts-ignore
  private moodManager: MoodManager;
  private responseCache: { [key: string]: string } = {};

  constructor(moodManager: MoodManager) {
    this.moodManager = moodManager;
  }

  public async transform(message: string, mood: Mood): Promise<string> {
    if (mood === Mood.Asleep) return "Zzz...";
    if (mood === Mood.Exhausted) return await this.transformExhausted(message);
    if (mood === Mood.Frustrated)
      return await this.transformFrustrated(message);
    if (mood === Mood.Bored) return await this.transformBored(message);
    if (mood === Mood.Curious) return await this.transformCurious(message);
    if (mood === Mood.Happy) return await this.transformHappy(message);
    return await this.transformCurious(message);
  }

  async transformGeneric(prompt: string): Promise<string> {
    if (this.responseCache[prompt]) return this.responseCache[prompt];
    const completion = await this.openAI.createCompletion("text-davinci-001", {
      prompt,
      max_tokens: 64,
    });
    if (!completion.data.choices) {
      return "I'm sorry, I don't understand.";
    }
    const choice =
      completion.data.choices[0].text || "I'm sorry, I don't understand.";
    this.responseCache[prompt] = choice;
    return choice;
  }

  async transformExhausted(message: string): Promise<string> {
    return await this.transformGeneric(`
Reword the following sentences in an exhausted fashion:

Original: Here's your reminder
Exhausted: Just, go do your reminder or something... I'm tired leave me be.
Original: ${message}
Exhausted:
    `);
  }

  async transformFrustrated(message: string): Promise<string> {
    return await this.transformGeneric(`
Reword the following sentences in an angry fashion:

Original: Here's your reminder
Angry: Go do this thing now!
Original: ${message}
Angry:
    `);
  }

  async transformBored(message: string): Promise<string> {
    return await this.transformGeneric(`
Reword the following sentences in a bored fashion:

Original: Here's your reminder
Bored: Come on, give me something else to do. Reminders are boring.
Original: ${message}
Bored:
    `);
  }

  async transformCurious(message: string): Promise<string> {
    return await this.transformGeneric(`
Reword the following sentences in a curious fashion:

Original: Here's your reminder
Curious: Ooh, I wonder what this is about? I'll remind you as soon as I can.
Original: ${message}
Curious:
    `);
  }

  async transformHappy(message: string): Promise<string> {
    return await this.transformGeneric(`
Reword the following sentences in a happy fashion:

Original: Here's your reminder
Happy: Thanks for asking, I'll remind you when I can!
Original: ${message}
Happy:
    `);
  }
}
