import { OpenWeatherMapApi } from "node-ts-open-weather-map";
import assert from "assert";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";

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

export default class WeatherCommand implements Command {
  public aliases = ["weather", "tenki"];
  public description = "Shows the weather";
  public usage = "weather";

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

  public async run(
    _conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const weather = await this.getWeather();
    if (!weather) {
      throw new Error("Could not get weather");
    }
    return `It's currently ${weather.main.temp}°C in ${weather.name}. Winds are ${weather.wind.speed}m/s. Overall, the weather is ${weather.weather[0].description}.`;
  }
}
