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
}
