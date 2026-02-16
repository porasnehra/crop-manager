import { RecommendationResult } from "@/lib/cropEngine";
import CropCard from "./CropCard";
import { CloudSun, Thermometer, Leaf } from "lucide-react";

interface ResultsPanelProps {
  result: RecommendationResult;
  onReset: () => void;
}

export default function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weather bar */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{result.weather}</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{result.temperature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{result.season} Season</span>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Top Crop Recommendations
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          for {result.location} · Compare and choose the best option for you
        </p>
      </div>

      {/* Crop cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {result.crops.map((crop, i) => (
          <CropCard key={crop.name} crop={crop} rank={i} />
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="text-sm text-primary hover:underline font-medium"
        >
          ← Try different inputs
        </button>
      </div>
    </div>
  );
}
