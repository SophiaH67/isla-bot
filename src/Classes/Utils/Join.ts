import assert from "assert";
import fetch from "node-fetch";

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

  public async sendNotification(
    text: string,
    tts = false
  ): Promise<JoinResponse> {
    const response = await this.sendPush({
      title: "Isla",
      text,
      icon: "https://cdn.discordapp.com/avatars/952582449437765632/909c5696487bcbd697eb8c468af48f5a.webp?",
      deviceId: "group.all",
      say: tts ? text : undefined,
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
