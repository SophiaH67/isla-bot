import BaseFrontend from "./BaseFrontend";
import prompt from "prompt";
import CLIMessageContext from "../Contexts/CLIMessageContext";

export default class CLIFrontend extends BaseFrontend {
  public async start() {
    prompt.start();
    while (true) {
      const { command } = await prompt.get(["command"]);
      const ctx = new CLIMessageContext(command.toString(), "CLI", this);
      this.commandHandler.handleMessage(ctx);
    }
  }

  public async broadcast(message: string) {
    console.log(`Broadcast: ${message}`);
  }
}
