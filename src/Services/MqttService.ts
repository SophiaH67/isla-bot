import { BaseService } from "./BaseService";
import * as mqtt from "mqtt";

enum IslaStatus {
  OFFLINE,
  ONLINE,
}

export default class MqttService implements BaseService {
  public mqttClient!: mqtt.MqttClient;

  onReady(): Promise<void> {
    console.log("Connecting to MQTT");
    this.mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
      will: {
        payload: Buffer.from(IslaStatus.OFFLINE.toString(), "utf8"),
        topic: "isla/status",
      },
    });
    this.mqttClient.on("connect", () => {
      console.log("Connected to MQTT");
    });

    this.mqttClient.publish("isla/status", IslaStatus.ONLINE.toString());

    return Promise.resolve();
  }
}
