import BaseFrontend from "./BaseFrontend";
import readline from "readline/promises";
import Isla from "../Isla";
import MockMessage from "../Utils/MockMessage";

export default class CLIFrontend extends BaseFrontend {
  constructor(private readonly isla: Isla) {
    super();
  }

  public async broadcast(message: string) {
    console.log(`Broadcast: ${message}`);
  }

  public async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const answer = (await rl.question("> ")).trim();
      if (!answer) continue;
      if (answer === "quit") {
        break;
      }
      const message = new MockMessage(this.isla, answer);
      await this.isla.onMessage(message);
    }
  }
}
