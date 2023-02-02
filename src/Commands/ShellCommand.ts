import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import cp from "child_process";

export default class ShellCommand implements Command {
  public description = "Execute a shell command";
  public usage = "shell <command>";
  public aliases = ["shell", "sh", "!", "eval"];

  private allowedUsers = ["123", "178210163369574401", "231446107794702336"];

  public run(conversation: Conversation, args: string[]): Promise<string> {
    if (!this.allowedUsers.includes(conversation.messages[0].author.id)) {
      return Promise.resolve("You are not allowed to use this command");
    }
    const [command, ...commandArgs] = args.slice(1);

    // Pipe the output of the command to the channel
    const child = cp.spawn(command, commandArgs, {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const handleData = (data: string) => {
      data = data.trim();
      if (!data) return;
      conversation.write(data);
    };

    child.stdout.on("data", (data) => handleData(data.toString()));
    child.stderr.on("data", (data) => handleData(data.toString()));

    return new Promise((resolve) => {
      child.on("close", (code) => {
        resolve(`Process exited with code ${code}`);
      });
    });
  }
}
