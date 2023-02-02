import Protocol from "../protocol/Protocol";
import HomeAssistant from "../Utils/HomeAssistant";
import BaseFrontend from "./BaseFrontend";

export default class HomeAssistantFrontend extends BaseFrontend {
  private hass = new HomeAssistant();

  public async start() {
    if (process.env.NODE_ENV === "production")
      await this.broadcast("Aila is now online.");
  }

  public async broadcast(message: string) {
    await this.hass.sayTts(message, "media_player.marnix_room_speaker");
  }

  public async setProtocol(protocol: Protocol) {
    switch (protocol) {
      case Protocol.Standard:
        await this.hass.activateScene("scene.marnix_normal");
        break;
      case Protocol.Safety:
        await this.hass.activateScene("scene.marnix_alarm");
        break;
      case Protocol.Emergency:
        await this.hass.activateScene("scene.marnix_emergency");
        break;
    }
  }
}
