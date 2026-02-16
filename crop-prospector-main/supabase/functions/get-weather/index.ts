import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lat, lon, city } = await req.json();

    // Use Open-Meteo (free, no API key needed)
    let url: string;
    if (lat && lon) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    } else {
      // Default coordinates for major Indian cities
      const cities: Record<string, { lat: number; lon: number }> = {
        "punjab": { lat: 31.1, lon: 75.3 },
        "maharashtra": { lat: 19.7, lon: 75.7 },
        "karnataka": { lat: 15.3, lon: 75.7 },
        "rajasthan": { lat: 27.0, lon: 74.2 },
        "kerala": { lat: 10.8, lon: 76.2 },
        "uttar pradesh": { lat: 26.8, lon: 80.9 },
        "tamil nadu": { lat: 11.1, lon: 78.6 },
        "madhya pradesh": { lat: 22.9, lon: 78.6 },
        "west bengal": { lat: 22.9, lon: 87.8 },
        "gujarat": { lat: 22.2, lon: 71.1 },
        "delhi": { lat: 28.6, lon: 77.2 },
      };
      const coords = cities[(city || "delhi").toLowerCase()] || cities["delhi"];
      url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API failed");
    
    const data = await response.json();

    // Map weather codes to descriptions
    const weatherCodes: Record<number, string> = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
      55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
      71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
      80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
      95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
    };

    const result = {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        feelsLike: data.current.apparent_temperature,
        windSpeed: data.current.wind_speed_10m,
        description: weatherCodes[data.current.weather_code] || "Unknown",
        weatherCode: data.current.weather_code,
      },
      daily: data.daily.time.map((date: string, i: number) => ({
        date,
        maxTemp: data.daily.temperature_2m_max[i],
        minTemp: data.daily.temperature_2m_min[i],
        precipitation: data.daily.precipitation_sum[i],
        description: weatherCodes[data.daily.weather_code[i]] || "Unknown",
        weatherCode: data.daily.weather_code[i],
      })),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weather error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
