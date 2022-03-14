import CommandHandler from "./Classes/CommandHandler";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";

const commandHandler = new CommandHandler();

const frontends = [
  new DiscordFrontend(commandHandler, process.env.DISCORD_TOKEN),
  new CLIFrontend(commandHandler),
];

frontends.forEach((frontend) => frontend.start());
