import CommandHandler from "./Classes/CommandHandler";
import DiscordFrontend from "./Classes/Frontends/DiscordFrontend";

const commandHandler = new CommandHandler();

const frontends = [
  new DiscordFrontend(
    commandHandler,
    "OTUyNTgyNDQ5NDM3NzY1NjMy.Yi4Hig.EeTbwTuW334Q9KMGS_Fbt9nBGk0"
  ),
];

frontends.forEach((frontend) => frontend.start());
