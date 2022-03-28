import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";
import { promisify } from "util";
const exec = promisify(require("child_process").exec);

export default class ProofOfWorkCommand implements BaseCommand {
  public name = "pow";
  public aliases = [
    "Information: Solve a proof of work",
    "Info: Solve a proof of work",
    "Notice: Solve a proof of work",
  ];

  public async run(ctx: BaseMessageContext) {
    const parts = ctx.message.split('"');
    const stringPrefix = parts[1];
    const hashPrefix = parts[3];

    const result = await exec(`./pow ${stringPrefix} ${hashPrefix}`);
    const [solution, hash] = result.stdout
      // Remove \n, \r and .
      .replace(/\n|\r|\./g, "")
      .split(" ");
    await ctx.reply(`Proof of work: "${solution}". Hash: "${hash}".`);
    ctx.close();
  }
}
