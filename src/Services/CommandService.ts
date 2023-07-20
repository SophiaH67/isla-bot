import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import { readdir } from "fs/promises";
import Command from "../Classes/Utils/Command";

const BASE_COMMAND_DIR = __dirname + "/../Commands";

export default class CommandService implements BaseService {
  public commands: Command[] = [];

  async onReady(_isla: Isla): Promise<void> {
    const files = await readdir(BASE_COMMAND_DIR);
    files.forEach((file) => {
      if (file.endsWith(".js") || file.endsWith(".ts")) {
        const command = require(`${BASE_COMMAND_DIR}/${file}`);
        this.commands.push(new command.default(this) as Command);
      }
    });
  }
}
