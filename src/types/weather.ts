export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    sunrise: number;
    sunset: number;
  };
  daily: {
    dt: number;
    temp: number; // Updated from object to number
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}

export interface Coordinates {
  lat: number;
  lon: number;
}