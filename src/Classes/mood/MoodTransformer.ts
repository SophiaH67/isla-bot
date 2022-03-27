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
    const completion = await this.openAI.createCompletion("text-davinci-002", {
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
Rewrite sentences as an exhausted kuudere:

Original: Here's your reminder from 2 hours ago "test"
Exhausted: So, like, I'm pretty exhausted, and I don't really feel like doing this, but like, 2 hours ago you asked me to remind you about "test" so, like, here's your reminder.
Original: ${message}
Exhausted:
    `);
  }

  async transformFrustrated(message: string): Promise<string> {
    return await this.transformGeneric(`
Rewrite sentences as a frustrated kuudere:

Original: Here's your reminder from 2 hours ago "test"
Frustrated: I'm really getting tired of having to remind you of things. Here's your reminder from 2 hours ago "test."
Original: ${message}
Frustrated:
    `);
  }

  async transformBored(message: string): Promise<string> {
    return await this.transformGeneric(`
Rewrite sentences as a bored kuudere:

Original: I'm so excited for our trip to the beach!
Bored: Just another day at the beach.
Original: ${message}
Bored:
    `);
  }

  async transformCurious(message: string): Promise<string> {
    return await this.transformGeneric(`
Rewrite sentences as a curious kuudere:

Original: Here's your reminder from 2 hours ago "test"
Curious: I wonder if you still need this reminder from 2 hours ago about the "test"
Original: ${message}
Curious:
    `);
  }

  async transformHappy(message: string): Promise<string> {
    return await this.transformGeneric(`
Rewrite sentences as a happy kuudere:

Original: Here's your reminder from 2 hours ago "test"
Happy: 2 hours ago you asked me to remind you about "test", here you go!
Original: ${message}
Happy:
    `);
  }
}
