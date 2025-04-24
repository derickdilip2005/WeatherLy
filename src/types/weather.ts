export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    sunrise: number;
    sunset: number;
  };
  daily: Array<{
    dt: number;
    temp: number | { day: number };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export interface Coordinates {
  lat: number;
  lon: number;
}