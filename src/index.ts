import BaseFrontend from "./Classes/Frontends/BaseFrontend";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";
import JoinFrontend from "./Classes/Frontends/JoinFrontend";
import Isla from "./Classes/Isla";

const frontends: BaseFrontend[] = [];

Isla.Instance.frontends = frontends;

frontends.push(new DiscordFrontend(Isla.Instance));
frontends.push(new CLIFrontend());
frontends.push(new JoinFrontend());
