import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";
import HomeAssistant from "../Classes/Utils/HomeAssistant";

export default class LightsCommand implements BaseCommand {
  public name = "lights";
  public aliases = ["turnon", "turnoff", "turn"];

  private entity = "light.marnix_bulb";
  private hass = new HomeAssistant();

  public async run(ctx: BaseMessageContext) {
    const words = ctx.message.split(" ").map((word) => word.toLowerCase());

    // Can be either on or off
    const targetState = words.includes("on")
      ? "on"
      : words.includes("off")
      ? "off"
      : null;

    if (!targetState) {
      await ctx.reply("E-Error, I couldn't figure out the desired state");
      return ctx.close();
    }

    await this.hass.reloadIkea();

    const res =
      targetState === "on"
        ? await this.hass.turnOn(this.entity)
        : await this.hass.turnOff(this.entity);

    if (res.status === 200) {
      await ctx.reply(`I turned ${targetState} the light`);
    } else {
      await ctx.reply(`E-Error, I couldn't turn the light ${targetState}`);
    }
    return ctx.close();
  }
}
