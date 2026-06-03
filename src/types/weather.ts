export type Units = "metric" | "imperial";

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface SavedCity extends GeoLocation {
  id: string; // `${lat},${lon}`
  addedAt: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  name: string;
  id: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number; // probability of precipitation 0..1
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
}

export interface AirPollutionItem {
  dt: number;
  main: { aqi: 1 | 2 | 3 | 4 | 5 };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface AirPollutionResponse {
  coord: { lon: number; lat: number };
  list: AirPollutionItem[];
}

export interface DailyAggregate {
  date: string; // YYYY-MM-DD
  dt: number;
  tempMin: number;
  tempMax: number;
  humidityAvg: number;
  popMax: number;
  weather: WeatherCondition;
  wind: number;
}
