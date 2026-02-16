// Crop recommendation engine with mock data
export interface FarmerInput {
  location: string;
  soilType: string;
  waterAvailability: string;
}

export interface CropRecommendation {
  name: string;
  emoji: string;
  profitPerAcre: number;
  risk: "low" | "medium" | "high";
  bestSowingTime: string;
  growthDuration: string;
  waterNeeded: string;
  description: string;
}

export interface RecommendationResult {
  location: string;
  weather: string;
  temperature: string;
  season: string;
  crops: CropRecommendation[];
}

const cropDatabase: Record<string, CropRecommendation[]> = {
  "alluvial": [
    { name: "Rice (Basmati)", emoji: "🌾", profitPerAcre: 45000, risk: "low", bestSowingTime: "June - July", growthDuration: "120-150 days", waterNeeded: "High", description: "Ideal for alluvial soil with good water. Consistent market demand ensures stable returns." },
    { name: "Wheat", emoji: "🌿", profitPerAcre: 35000, risk: "low", bestSowingTime: "October - November", growthDuration: "120-140 days", waterNeeded: "Medium", description: "Staple crop with guaranteed MSP. Very low risk for alluvial soil regions." },
    { name: "Tomato", emoji: "🍅", profitPerAcre: 70000, risk: "high", bestSowingTime: "January - February", growthDuration: "60-90 days", waterNeeded: "Medium", description: "High profit potential but price volatility makes it risky. Best for experienced farmers." },
  ],
  "black": [
    { name: "Cotton", emoji: "🏵️", profitPerAcre: 55000, risk: "medium", bestSowingTime: "May - June", growthDuration: "150-180 days", waterNeeded: "Medium", description: "Black soil retains moisture well for cotton. Good export demand and stable prices." },
    { name: "Soybean", emoji: "🫘", profitPerAcre: 40000, risk: "low", bestSowingTime: "June - July", growthDuration: "90-120 days", waterNeeded: "Low", description: "Excellent nitrogen-fixing crop. Low input cost and consistent demand in oil industry." },
    { name: "Sugarcane", emoji: "🎋", profitPerAcre: 80000, risk: "medium", bestSowingTime: "February - March", growthDuration: "12-18 months", waterNeeded: "High", description: "Very high returns but needs significant water and longer commitment. Mill proximity is important." },
  ],
  "red": [
    { name: "Groundnut", emoji: "🥜", profitPerAcre: 42000, risk: "low", bestSowingTime: "June - July", growthDuration: "100-130 days", waterNeeded: "Low", description: "Well-suited for red soil. Low water requirement and multiple uses ensure steady demand." },
    { name: "Millets (Ragi)", emoji: "🌾", profitPerAcre: 30000, risk: "low", bestSowingTime: "May - June", growthDuration: "90-120 days", waterNeeded: "Low", description: "Super crop of the future. Government push and health trend increasing demand rapidly." },
    { name: "Chili", emoji: "🌶️", profitPerAcre: 65000, risk: "high", bestSowingTime: "July - August", growthDuration: "120-150 days", waterNeeded: "Medium", description: "High profit but susceptible to pest attacks. Good for farmers with pest management experience." },
  ],
  "sandy": [
    { name: "Bajra (Pearl Millet)", emoji: "🌾", profitPerAcre: 25000, risk: "low", bestSowingTime: "June - July", growthDuration: "70-90 days", waterNeeded: "Low", description: "Drought-resistant crop perfect for sandy soil. Growing health food market adds value." },
    { name: "Cumin", emoji: "✨", profitPerAcre: 55000, risk: "medium", bestSowingTime: "November - December", growthDuration: "100-120 days", waterNeeded: "Low", description: "High-value spice crop. Excellent for sandy soil with low water but needs frost-free conditions." },
    { name: "Watermelon", emoji: "🍉", profitPerAcre: 60000, risk: "high", bestSowingTime: "February - March", growthDuration: "80-100 days", waterNeeded: "Medium", description: "Sandy soil is ideal. High summer demand gives great margins but transport costs can eat profits." },
  ],
  "laterite": [
    { name: "Cashew", emoji: "🌰", profitPerAcre: 50000, risk: "low", bestSowingTime: "June - July", growthDuration: "3-5 years (perennial)", waterNeeded: "Low", description: "Long-term investment with excellent returns. Laterite soil is naturally suited for cashew." },
    { name: "Tapioca", emoji: "🥔", profitPerAcre: 35000, risk: "low", bestSowingTime: "April - May", growthDuration: "8-10 months", waterNeeded: "Low", description: "Hardy crop that thrives in laterite soil. Growing industrial demand for starch." },
    { name: "Pepper", emoji: "🫑", profitPerAcre: 75000, risk: "medium", bestSowingTime: "May - June", growthDuration: "3-4 years (perennial)", waterNeeded: "Medium", description: "Black gold of spices. Premium export prices but requires patience and shade management." },
  ],
};

const weatherData: Record<string, { weather: string; temperature: string; season: string }> = {
  "punjab": { weather: "Partly Cloudy", temperature: "28°C", season: "Kharif" },
  "maharashtra": { weather: "Sunny", temperature: "32°C", season: "Kharif" },
  "karnataka": { weather: "Light Rain", temperature: "26°C", season: "Kharif" },
  "rajasthan": { weather: "Hot & Dry", temperature: "38°C", season: "Kharif" },
  "kerala": { weather: "Monsoon Rain", temperature: "27°C", season: "Kharif" },
  "uttar pradesh": { weather: "Humid", temperature: "30°C", season: "Kharif" },
  "tamil nadu": { weather: "Warm", temperature: "33°C", season: "Rabi" },
  "madhya pradesh": { weather: "Partly Cloudy", temperature: "29°C", season: "Kharif" },
  "west bengal": { weather: "Humid", temperature: "31°C", season: "Kharif" },
  "gujarat": { weather: "Hot", temperature: "35°C", season: "Kharif" },
};

export function getRecommendations(input: FarmerInput): RecommendationResult {
  const locationKey = input.location.toLowerCase().trim();
  const soilKey = input.soilType.toLowerCase().trim();
  
  const weather = weatherData[locationKey] || { weather: "Moderate", temperature: "30°C", season: "Kharif" };
  
  let crops = cropDatabase[soilKey] || cropDatabase["alluvial"];
  
  // Adjust based on water availability
  if (input.waterAvailability === "low") {
    crops = crops.map(c => ({
      ...c,
      profitPerAcre: c.waterNeeded === "High" ? Math.round(c.profitPerAcre * 0.6) : c.profitPerAcre,
      risk: c.waterNeeded === "High" ? "high" as const : c.risk,
    }));
  }

  // Sort by profit
  crops = [...crops].sort((a, b) => b.profitPerAcre - a.profitPerAcre);

  return {
    location: input.location,
    weather: weather.weather,
    temperature: weather.temperature,
    season: weather.season,
    crops,
  };
}
