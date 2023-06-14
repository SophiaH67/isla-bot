import assert from "assert";
import fetch from "node-fetch";

export default class HomeAssistant {
  private url = "https://homeassistant.marnixah.com/";
  private token: string;

  constructor() {
    assert(process.env.HA_TOKEN, "HomeAssistant token is required");
    this.token = process.env.HA_TOKEN;
  }

  public call(endpoint: string, entity?: string, data: any = {}) {
    const url = `${this.url}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };
    const body = JSON.stringify({ entity_id: entity, ...data });
    return fetch(url, { method: "POST", headers, body });
  }

  public turnOn(entity: string) {
    return this.call("api/services/light/turn_on", entity);
  }

  public turnOff(entity: string) {
    return this.call("api/services/light/turn_off", entity);
  }

  public reloadIkea() {
    return this.call(
      "api/config/config_entries/entry/f19dc902eac14b49fd1e72a6220f7ff4/reload"
    );
  }

  public activateScene(scene: string) {
    return this.call("api/services/scene/turn_on", scene);
  }

  public sayTts(message: string, entity: string) {
    return this.call("api/services/tts/google_translate_say", entity, {
      message,
    });
  }
}
