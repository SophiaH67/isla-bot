export default class TimeParser {
  public text = "";
  public time: number | undefined;

  constructor(text: string) {
    this.text = text;
    this.parse();
  }

  private parse() {
    const time = this.text.match(/(\d+)\s*(mins|hours|days)/);
    if (time) {
      this.time = parseInt(time[1], 10);
      switch (time[2]) {
        case "mins":
          this.time *= 60;
          break;
        case "hours":
          this.time *= 60 * 60;
          break;
        case "days":
          this.time *= 60 * 60 * 24;
          break;
      }
    }
  }
}
