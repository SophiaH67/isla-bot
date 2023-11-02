import { t } from "../Classes/mood/dicts";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import HomeAssistant from "../Classes/Utils/HomeAssistant";

export default class LightsCommand implements Command {
  public aliases = ["lights"];
  public description = "Turns the light on or off";
  public usage = "lights <on/off>";

  private entity = "light.marnix_bulb";
  private hass = new HomeAssistant();

  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const words = args.map((word) => word.toLowerCase());

    // Can be either on or off
    const targetState = words.includes("on")
      ? "on"
      : words.includes("off")
      ? "off"
      : null;

    if (!targetState) {
      return t(conversation, "lightStateUnknown");
    }

    await this.hass.reloadIkea();

    const on = targetState === "on";

    const res = on
      ? await this.hass.turnOn(this.entity)
      : await this.hass.turnOff(this.entity);

    if (res.status === 200) {
      return t(conversation, on ? "lightStateChangeOn" : "lightStateChangeOff");
    } else {
      return t(conversation, "lightStateChangeError");
    }
  }
}
