import CommandHandler from "./Classes/CommandHandler";
import BaseFrontend from "./Classes/Frontends/BaseFrontend";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";
import HTTPFrontend from "./Classes/Frontends/HTTPFrontend";
import JoinFrontend from "./Classes/Frontends/JoinFrontend";
import Isla from "./Classes/Isla";

const commandHandler = new CommandHandler();

const frontends: BaseFrontend[] = [];

Isla.Instance.frontends = frontends;

frontends.push(new DiscordFrontend(commandHandler, process.env.DISCORD_TOKEN));
frontends.push(new CLIFrontend(commandHandler));
frontends.push(new HTTPFrontend(commandHandler));
frontends.push(new JoinFrontend(commandHandler));

frontends.forEach((frontend) => frontend.start());
