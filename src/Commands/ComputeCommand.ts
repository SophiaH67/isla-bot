import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import { Configuration, OpenAIApi } from "openai";

export default class ComputeCommand extends Command {
  public aliases = ["compute"];
  public description = "Asks GPT-3 to compute something.";
  public usage = "compute <expression>";

  private config: Configuration = new Configuration({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });
  private openAI: OpenAIApi = new OpenAIApi(this.config);

  public async run(
    _conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const completion = await this.openAI.createCompletion("text-davinci-002", {
      prompt: args.slice(1).join(" "),
      max_tokens: 64,
    });

    if (!completion.data.choices || !completion.data.choices[0].text) {
      return "I'm sorry, I don't understand.";
    }

    const choice = completion.data.choices[0].text.trim();

    await _conversation.reference.reply({
      content: choice,
    });

    return ""; // Skip the middleware
  }
}
