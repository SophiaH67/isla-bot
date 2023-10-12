import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { AdminGuard } from "../Classes/Utils/AdminGuard";
import LoggingService from "../Services/LoggingService";
import { t } from "../Classes/mood/dicts";
import UnexpectedRestartService from "../Services/UnexpectedRestartService";

export default class UpdateCommand implements Command {
  public aliases = ["updateisla", "upgradeisla"];
  public description = "Updates Isla";
  public usage = "updateisla";

  @AdminGuard
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const logger = conversation.isla
      .getService(LoggingService)
      .getLogger(UpdateCommand.name);

    const unexpectedRestartService = conversation.isla.getService(
      UnexpectedRestartService
    );

    // Spawn an alpine docker container to update this instance of Isla
    const { exec } = require("child_process");

    logger.warn(t(conversation, "updateStarting"));

    await unexpectedRestartService.unlock();

    exec(
      'docker run -d --rm -v /var/run/docker.sock:/var/run/docker.sock -v /Fuwawa/config/docker-compose/isla:/Fuwawa/config/docker-compose/isla docker sh -c "cd /Fuwawa/config/docker-compose/isla && docker compose pull && docker compose up -d"',
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          logger.error(t(conversation, "updateError"));
          logger.debug(error);
          return;
        }
        if (stderr) {
          logger.debug(stderr);
          return;
        }
        logger.debug(stdout);
      }
    );

    return t(conversation, "updateDone");
  }
}
