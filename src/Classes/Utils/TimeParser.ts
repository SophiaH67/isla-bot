export default class TimeParser {
  public text = "";
  public time: number | undefined;
  private multiplierDict = {
    s: 1,
    sec: 1,
    secs: 1,
    seconds: 1,
    m: 60,
    min: 60,
    mins: 60,
    minutes: 60,
    h: 60 * 60,
    hr: 60 * 60,
    hrs: 60 * 60,
    hours: 60 * 60,
    d: 60 * 60 * 24,
    day: 60 * 60 * 24,
    days: 60 * 60 * 24,
  };

  constructor(text: string) {
    this.text = text;
    this.parse();
  }

  private parse() {
    const time = this.text.match(
      /(\d+)\s*(s|sec|secs|seconds|m|min|mins|minutes|h|hr|hrs|hours|d|day|days)/
    );
    if (!time || !(time[2] in this.multiplierDict)) {
      return;
    }

    // @ts-ignore because we know it's a number
    this.time = parseInt(time[1], 10) * this.multiplierDict[time[2]];
  }
}
