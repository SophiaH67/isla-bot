import CommandHandler from "./Classes/CommandHandler";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";

const commandHandler = new CommandHandler();

const frontends = [
  new DiscordFrontend(
    commandHandler,
    "OTUyNTgyNDQ5NDM3NzY1NjMy.Yi4Hig.EeTbwTuW334Q9KMGS_Fbt9nBGk0"
  ),
  new CLIFrontend(commandHandler),
];

frontends.forEach((frontend) => frontend.start());
