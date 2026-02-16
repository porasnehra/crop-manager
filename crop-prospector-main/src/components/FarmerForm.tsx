import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, MapPin, Droplets, Mountain } from "lucide-react";

interface FarmerFormProps {
  onSubmit: (data: { location: string; soilType: string; waterAvailability: string }) => void;
  isLoading: boolean;
}

const locations = [
  "Punjab", "Maharashtra", "Karnataka", "Rajasthan", "Kerala",
  "Uttar Pradesh", "Tamil Nadu", "Madhya Pradesh", "West Bengal", "Gujarat"
];

const soilTypes = [
  { value: "alluvial", label: "Alluvial Soil" },
  { value: "black", label: "Black Soil (Regur)" },
  { value: "red", label: "Red Soil" },
  { value: "sandy", label: "Sandy Soil" },
  { value: "laterite", label: "Laterite Soil" },
];

const waterLevels = [
  { value: "high", label: "High (Canal / River nearby)" },
  { value: "medium", label: "Medium (Borewell / Well)" },
  { value: "low", label: "Low (Rain-dependent)" },
];

export default function FarmerForm({ onSubmit, isLoading }: FarmerFormProps) {
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [waterAvailability, setWaterAvailability] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && soilType && waterAvailability) {
      onSubmit({ location, soilType, waterAvailability });
    }
  };

  const isValid = location && soilType && waterAvailability;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Location (State)
        </label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Mountain className="h-4 w-4 text-primary" />
          Soil Type
        </label>
        <Select value={soilType} onValueChange={setSoilType}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select soil type" />
          </SelectTrigger>
          <SelectContent>
            {soilTypes.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Droplets className="h-4 w-4 text-primary" />
          Water Availability
        </label>
        <Select value={waterAvailability} onValueChange={setWaterAvailability}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select water availability" />
          </SelectTrigger>
          <SelectContent>
            {waterLevels.map(w => (
              <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full gradient-hero text-primary-foreground font-semibold py-6 text-base"
      >
        <Sprout className="mr-2 h-5 w-5" />
        {isLoading ? "Analyzing..." : "Get Crop Recommendations"}
      </Button>
    </form>
  );
}
