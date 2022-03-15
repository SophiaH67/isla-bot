import Isla from "../Isla";
import Mood from "./Moods";
import MoodTransformer from "./MoodTransformer";

export default class MoodManager {
  private tickDelay = 10000;
  public isla: Isla;
  public moodTransformer: MoodTransformer;

  // Actual mood factors
  public sleeping = false;
  public _exhaustion = 0;
  public _frustration = 0;
  public _curiosity = 0.5;
  public _happiness = 0.5;
  public _focus = 0.5;

  // Getters
  public get exhaustion(): number {
    return this._exhaustion;
  }

  public get frustration(): number {
    return this._frustration;
  }

  public get curiosity(): number {
    return this._curiosity;
  }

  public get happiness(): number {
    return this._happiness;
  }

  public get focus() {
    return this._focus;
  }

  // Setters
  public set exhaustion(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._exhaustion = value;
  }

  public set frustration(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._frustration = value;
  }

  public set curiosity(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._curiosity = value;
  }

  public set happiness(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._happiness = value;
  }

  public set focus(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this._focus = value;
  }

  // Mood flags
  public exhausted = false;
  public frustrated = false;
  public curious = false;
  public happy = false;
  public bored = false;

  constructor(isla: Isla) {
    this.isla = isla;
    this.moodTransformer = new MoodTransformer(this);

    this.tick();
    setInterval(() => this.tick(), this.tickDelay);
  }

  public async transformMessage(message: string): Promise<string> {
    return await (
      await this.moodTransformer.transform(message, this.mood)
    ).trim();
  }

  tick() {
    this.exhaustion += this.sleeping ? -0.1 : 0.01;

    this.happiness += (Math.random() - (this.sleeping ? 0.2 : 0.5)) * 0.3;
    this.focus += (Math.random() - (this.sleeping ? 0.2 : 0.5)) * 0.3;
    this.curiosity += (Math.random() - (this.sleeping ? 0.2 : 0.5)) * 0.3;

    this.calculateMood();

    if (this.exhaustion > 0.9) {
      this.sleeping = true;
    } else if (this.exhaustion < 0.1) {
      this.sleeping = false;
    }

    console.log(
      `Mood: ${this.mood} | Exhaustion: ${this.exhaustion} | Frustration: ${this.frustration} | Curiosity: ${this.curiosity} | Happiness: ${this.happiness} | Focus: ${this.focus}`
    );
  }

  calculateMood() {
    this.exhausted = this.exhaustion > 0.4;
    this.frustrated = this.frustration > 0.4;
    this.curious = this.curiosity > 0.4;
    this.happy = this.happiness > 0.4;
    this.bored = this.focus < 0.6;
  }

  public get mood(): Mood {
    if (this.sleeping) return Mood.Asleep;
    if (this.exhausted) return Mood.Exhausted;
    if (this.frustrated) return Mood.Frustrated;
    if (this.curious) return Mood.Curious;
    if (this.happy) return Mood.Happy;

    return Mood.Bored;
  }

  public wakeUp() {
    this.sleeping = false;
    //@TODO: increase exhaustion modifier by some amount
  }

  public get mooodIcon(): string {
    return "https://cdn.discordapp.com/avatars/952582449437765632/909c5696487bcbd697eb8c468af48f5a.webp?";
  }
}
