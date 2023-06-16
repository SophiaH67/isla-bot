import Conversation from 'src/isla-chat/Conversation';
import Command from '../Command';
import HomeAssistant from '../HomeAssistant';

export default class LightsCommand implements Command {
  public aliases = ['lights', 'turnon', 'turnoff', 'turn'];
  public description = 'Turns the light on or off';
  public usage = 'lights <on/off>';

  private entity = 'light.marnix_bulb';
  private hass = new HomeAssistant();

  public async run(
    _conversation: Conversation,
    args: string[],
  ): Promise<string> {
    const words = args.map((word) => word.toLowerCase());

    // Can be either on or off
    const targetState = words.includes('on')
      ? 'on'
      : words.includes('off')
      ? 'off'
      : null;

    if (!targetState) {
      return "Error, I couldn't figure out the desired state";
    }

    await this.hass.reloadIkea();

    const res =
      targetState === 'on'
        ? await this.hass.turnOn(this.entity)
        : await this.hass.turnOff(this.entity);

    if (res.status === 200) {
      return `The light is now ${targetState}`;
    } else {
      return `Error, I couldn't turn the light ${targetState}`;
    }
  }
}
