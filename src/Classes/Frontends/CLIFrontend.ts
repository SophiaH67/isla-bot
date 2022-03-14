import BaseFrontend from "./BaseFrontend";
import prompt from "prompt";
import MessageContext from "../MessageContext";

export default class CLIFrontend extends BaseFrontend {
  public async start() {
    prompt.start();
    while (true) {
      const { command } = await prompt.get(["command"]);
      const ctx = new MessageContext(
        command.toString(),
        "console",
        async (reply) => console.log(reply)
      );
      this.commandHandler.handleMessage(ctx);
    }
  }
}
