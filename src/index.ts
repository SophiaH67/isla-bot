import BaseFrontend from "./Classes/Frontends/BaseFrontend";
import CLIFrontend from "./Classes/Frontends/CLIFrontend";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";
import HttpFrontend from "./Classes/Frontends/HttpFrontend";
import JoinFrontend from "./Classes/Frontends/JoinFrontend";
import WebsocketFrontend from "./Classes/Frontends/WebsocketFrontend";
import Isla from "./Classes/Isla";

const frontends: BaseFrontend[] = [];

Isla.Instance.frontends = frontends;

frontends.push(new DiscordFrontend(Isla.Instance));
frontends.push(new CLIFrontend(Isla.Instance));
frontends.push(new JoinFrontend());
frontends.push(new WebsocketFrontend(Isla.Instance));
frontends.push(new HttpFrontend(Isla.Instance));
