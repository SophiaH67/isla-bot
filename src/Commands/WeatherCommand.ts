import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";
import { OpenWeatherMapApi } from "node-ts-open-weather-map";
import assert from "assert";

interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export default class WeatherCommand implements BaseCommand {
  public name = "weather";
  public aliases = ["tenki"];

  private apiKey = process.env.WEATHER_KEY || assert.fail("WEATHER_KEY");
  private openWeatherMapApi = new OpenWeatherMapApi({
    key: this.apiKey,
  });

  private async getWeather() {
    try {
      const data: WeatherResponse = await this.openWeatherMapApi.byCityId(
        2743476
      );
      return data;
    } catch (e) {
      return false;
    }
  }

  public async run(ctx: BaseMessageContext) {
    const weather = await this.getWeather();
    if (!weather) {
      ctx.reply("E-Error, I couldn't get the weather");
      return ctx.close();
    }
    ctx.reply(
      `It's currently ${weather.main.temp}°C in ${weather.name} with wind speeds reaching ${weather.wind.speed}m/s. The weather is ${weather.weather[0].description}`
    );
    return ctx.close();
  }
}
