import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CloudSun, Droplets, Wind, Thermometer, CloudRain } from "lucide-react";

interface CurrentWeather {
  temperature: number;
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  description: string;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  description: string;
}

interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

const weatherIcons: Record<string, string> = {
  "Clear sky": "☀️", "Mainly clear": "🌤️", "Partly cloudy": "⛅", "Overcast": "☁️",
  "Fog": "🌫️", "Light drizzle": "🌦️", "Moderate drizzle": "🌧️", "Slight rain": "🌧️",
  "Moderate rain": "🌧️", "Heavy rain": "⛈️", "Thunderstorm": "⛈️", "Slight rain showers": "🌦️",
};

export default function WeatherWidget({ city }: { city?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState(city || "Delhi");

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-weather", {
        body: { city: city || locationName },
      });
      if (fnError) throw fnError;
      setWeather(data);
    } catch (e: any) {
      setError(e.message || "Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-card animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-10 bg-muted rounded w-1/2 mb-2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-card text-center">
        <p className="text-muted-foreground text-sm">{error || "No weather data"}</p>
      </div>
    );
  }

  const icon = weatherIcons[weather.current.description] || "🌤️";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">🌦️ Weather</h2>
        <p className="text-muted-foreground text-sm mt-1">{locationName}</p>
      </div>

      {/* Current weather */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-5xl">{icon}</span>
            <p className="text-sm text-muted-foreground mt-2">{weather.current.description}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-foreground">{Math.round(weather.current.temperature)}°C</p>
            <p className="text-sm text-muted-foreground">Feels like {Math.round(weather.current.feelsLike)}°C</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-1">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Humidity</span>
            <span className="text-sm font-semibold text-foreground">{weather.current.humidity}%</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wind className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Wind</span>
            <span className="text-sm font-semibold text-foreground">{weather.current.windSpeed} km/h</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Feels Like</span>
            <span className="text-sm font-semibold text-foreground">{Math.round(weather.current.feelsLike)}°C</span>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <h3 className="font-semibold text-foreground text-sm mb-3">7-Day Forecast</h3>
        <div className="space-y-2">
          {weather.daily.slice(0, 7).map((day) => {
            const dayIcon = weatherIcons[day.description] || "🌤️";
            const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
            return (
              <div key={day.date} className="flex items-center justify-between text-sm">
                <span className="w-10 text-muted-foreground">{dayName}</span>
                <span>{dayIcon}</span>
                <div className="flex items-center gap-1">
                  <CloudRain className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground w-12">{day.precipitation}mm</span>
                </div>
                <span className="text-foreground font-medium">{Math.round(day.maxTemp)}°</span>
                <span className="text-muted-foreground">{Math.round(day.minTemp)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
