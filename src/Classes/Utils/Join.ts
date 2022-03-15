import assert from "assert";
import fetch from "node-fetch";
import Isla from "../Isla";

interface JoinResponse {
  success: boolean;
  userAuthError: boolean;
  records: {
    id: string;
    regId: string;
    userAccount: string;
    deviceName: string;
    deviceType: number;
    apiLevel: number;
  }[];
}

interface PushParams {
  deviceId?:
    | "group.all"
    | "group.android"
    | "group.windows10"
    | "group.phone"
    | "group.tablet"
    | "group.pc";
  text?: string;
  title?: string;
  icon?: string;
  url?: string;
  clipboard?: string;
  file?: string;
  smsnumber?: string;
  smstext?: string;
  smscontactname?: string;
  lockWallpaper?: string;
  find?: boolean;
  mediaVolume?: number;
  ringVolume?: number;
  alarmVolume?: number;
  interruptionFilter?: 1 | 2 | 3 | 4;
  say?: string;
  language?: string;
  app?: string;
  appPackage?: string;
}

export default class Join {
  /**
   * This class is used to interact with joaoapps's Join API.
   */
  private apiKey: string =
    process.env.JOIN_KEY || assert.fail("JOIN_KEY is required");
  public isla = Isla.Instance;

  public constructURL(endpoint: string, params: any = {}): string {
    params.apikey = this.apiKey;
    const query = Object.keys(params)
      .map((key) => `${key}=${encodeURI(params[key])}`)
      .join("&");
    return `https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/${endpoint}?${query}`;
  }

  public async sendPush(params: PushParams): Promise<JoinResponse> {
    const url = this.constructURL("sendPush", params);
    const response = await fetch(url);
    const responseText = await response.text();
    return JSON.parse(responseText);
  }

  public async sendNotification(text: string): Promise<JoinResponse> {
    const response = await this.sendPush({
      title: await this.isla.moodManager.transformMessage(
        "I have a message for you"
      ),
      text,
      icon: this.isla.moodManager.mooodIcon,
      deviceId: "group.all",
    });
    return response;
  }

  public ringPhone(): Promise<JoinResponse> {
    return this.sendPush({
      deviceId: "group.phone",
      find: true,
    });
  }
}
