'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { OPENWEATHER_API_KEY } from '@/config/api';
import { WeatherData, Coordinates } from '@/types/weather';
import LoadingScreen from './LoadingScreen';

interface WeatherListItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

export default function WeatherDashboard({ coordinates }: { coordinates: Coordinates }) {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GSAP animation effect
  useEffect(() => {
    if (weatherData && cardsRef.current.length > 0) {
      const currentCards = cardsRef.current; // Store ref value
      
      // Initial animation for cards
      gsap.fromTo(currentCards,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8,
          rotateX: -30
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          transformOrigin: "center bottom"
        }
      );

      // Add hover animations
      currentCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Use stored ref value in cleanup
      return () => {
        currentCards.forEach(card => {
          card?.removeEventListener('mouseenter', () => {});
          card?.removeEventListener('mouseleave', () => {});
        });
      };
    }
  }, [weatherData]);

  // Fetch weather data effect
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (coordinates.lat === 0 && coordinates.lon === 0) return;

      try {
        const currentWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        // Update the forecast data mapping
        const formattedData: WeatherData = {
          current: {
            temp: currentWeather.data.main.temp,
            humidity: currentWeather.data.main.humidity,
            pressure: currentWeather.data.main.pressure,
            wind_speed: currentWeather.data.wind.speed,
            sunrise: currentWeather.data.sys.sunrise,
            sunset: currentWeather.data.sys.sunset
          },
          daily: forecast.data.list
            .filter((_: unknown, index: number) => index % 8 === 0)
            .slice(0, 5)
            .map((day: WeatherListItem) => ({
              dt: day.dt,
              temp: day.main.temp, // Simplified temperature structure
              weather: day.weather
            }))
        };

        setWeatherData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data');
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  // Debug log effect
  useEffect(() => {
    console.log('Weather data state:', weatherData);
  }, [weatherData]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!weatherData || !weatherData.current) return <LoadingScreen />;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 p-4">
        {/* Current Weather Card */}
        <div className="p-6 bg-[#1c1917] rounded-xl shadow-lg border-2 border-red-500 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-4 text-red-500 border-b border-red-500/20 pb-2">Current Weather</h2>
          <div className="space-y-3">
            <p className="text-red-400 text-xl">
              {weatherData.current.temp !== undefined 
                ? `${Math.round(weatherData.current.temp)}°C`
                : 'N/A'}
            </p>
            <p className="text-red-400/80">{new Date().toLocaleDateString()}</p>
            <p className="text-red-400/80">{new Date().toLocaleString('en-US', { weekday: 'long' })}</p>
          </div>
        </div>

        {/* 5-Day Forecast Card */}
        <div className="p-6 bg-[#1c1917] rounded-xl shadow-lg border-2 border-red-500 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-4 text-red-500 border-b border-red-500/20 pb-2">5-Day Forecast</h2>
          <div className="space-y-3">
            {weatherData.daily.map((day, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-red-400/80">{day.dt ? new Date(day.dt * 1000).toLocaleDateString() : 'N/A'}</span>
                {/* Temperature display */}
                <span className="text-red-400">
                  {day.temp !== undefined 
                    ? `${Math.round(day.temp)}°C`
                    : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

          {/* Weather Details Card */}
          <div className="p-6 bg-[#1c1917] rounded-xl shadow-lg border-2 border-red-500 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4 text-red-500 border-b border-red-500/20 pb-2">Weather Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-400/80">Humidity</span>
                <span className="text-red-400">{weatherData.current.humidity !== undefined ? weatherData.current.humidity + '%' : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400/80">Pressure</span>
                <span className="text-red-400">{weatherData.current.pressure !== undefined ? weatherData.current.pressure + ' hPa' : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400/80">Wind Speed</span>
                <span className="text-red-400">{weatherData.current.wind_speed !== undefined ? weatherData.current.wind_speed + ' m/s' : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Sun Times Card */}
          <div className="p-6 bg-[#1c1917] rounded-xl shadow-lg border-2 border-red-500 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-4 text-red-500 border-b border-red-500/20 pb-2">Sun Times</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-400/80">Sunrise</span>
                <span className="text-red-400">{weatherData.current.sunrise !== undefined ? new Date(weatherData.current.sunrise * 1000).toLocaleTimeString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400/80">Sunset</span>
                <span className="text-red-400">{weatherData.current.sunset !== undefined ? new Date(weatherData.current.sunset * 1000).toLocaleTimeString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Remove the entire Map Container section below */}
      </>
    );
}