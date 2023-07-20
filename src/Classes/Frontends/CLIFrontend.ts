import BaseFrontend from "./BaseFrontend";
import readline from "readline/promises";
import Isla from "../Isla";
import { IslaMessage } from "../interfaces/IslaMessage";
import { IslaUser } from "../interfaces/IslaUser";
import { uuid } from "uuidv4";

export default class CLIFrontend extends BaseFrontend {
  private userAuthor = new IslaUser("cli-user", "Marni");

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
      const message: IslaMessage = new IslaMessage(
        this.isla,
        answer,
        async (content) => {
          console.log(`[Isla] ${content}`);
        },
        this.userAuthor,
        uuid()
      );

      await this.isla.onMessage(message);
    }
  }
}
