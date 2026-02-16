import { CropRecommendation } from "@/lib/cropEngine";
import { TrendingUp, Calendar, Droplets, Clock, AlertTriangle, Shield, ShieldAlert } from "lucide-react";

interface CropCardProps {
  crop: CropRecommendation;
  rank: number;
}

const riskConfig = {
  low: { label: "Low Risk", icon: Shield, className: "bg-success/10 text-success" },
  medium: { label: "Medium Risk", icon: ShieldAlert, className: "bg-warning/10 text-warning" },
  high: { label: "High Risk", icon: AlertTriangle, className: "bg-destructive/10 text-destructive" },
};

export default function CropCard({ crop, rank }: CropCardProps) {
  const risk = riskConfig[crop.risk];
  const RiskIcon = risk.icon;

  return (
    <div
      className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{crop.emoji}</span>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {crop.name}
            </h3>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${risk.className}`}>
              <RiskIcon className="h-3 w-3" />
              {risk.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Profit / Acre</p>
          <p className="text-xl font-bold text-primary">
            ₹{crop.profitPerAcre.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {crop.description}
      </p>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div className="flex flex-col items-center gap-1 text-center">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Sowing</span>
          <span className="text-xs font-semibold text-foreground">{crop.bestSowingTime}</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Duration</span>
          <span className="text-xs font-semibold text-foreground">{crop.growthDuration}</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Droplets className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Water</span>
          <span className="text-xs font-semibold text-foreground">{crop.waterNeeded}</span>
        </div>
      </div>
    </div>
  );
}
