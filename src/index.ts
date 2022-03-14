import CommandHandler from "./Classes/CommandHandler";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";
import HTTPFrontend from "./Classes/Frontends/HTTPFrontend";

const commandHandler = new CommandHandler();

const frontends = [
  new DiscordFrontend(commandHandler, process.env.DISCORD_TOKEN),
  new CLIFrontend(commandHandler),
  new HTTPFrontend(commandHandler),
];

frontends.forEach((frontend) => frontend.start());
