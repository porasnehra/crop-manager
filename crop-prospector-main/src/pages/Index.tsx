import { useState } from "react";
import FarmerForm from "@/components/FarmerForm";
import ResultsPanel from "@/components/ResultsPanel";
import DiseaseDetection from "@/components/DiseaseDetection";
import WeatherWidget from "@/components/WeatherWidget";
import Marketplace from "@/components/Marketplace";
import { getRecommendations, RecommendationResult, FarmerInput } from "@/lib/cropEngine";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, Leaf, CloudSun, ShoppingCart, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "home" | "disease" | "weather" | "marketplace";

const Index = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("home");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: FarmerInput) => {
    setIsLoading(true);
    setTimeout(() => {
      const recommendations = getRecommendations(data);
      setResult(recommendations);
      setIsLoading(false);
    }, 1200);
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "Crop Plan", icon: Home },
    { key: "disease", label: "Disease", icon: Leaf },
    { key: "weather", label: "Weather", icon: CloudSun },
    { key: "marketplace", label: "Market", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Sprout className="h-6 w-6 text-primary-foreground" />
          <h1 className="font-display text-lg font-bold text-primary-foreground tracking-tight">AgriSmart</h1>
          <span className="ml-auto text-xs text-primary-foreground/70">
            {user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); if (t.key === "home") setResult(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "home" && (
          !result ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">Smart Crop Planning</h2>
                <p className="text-muted-foreground leading-relaxed">Enter your farm details and get AI-powered recommendations.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <FarmerForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-6">🌱 Right crop · Right time · Maximum profit</p>
            </div>
          ) : (
            <ResultsPanel result={result} onReset={() => setResult(null)} />
          )
        )}
        {tab === "disease" && <DiseaseDetection />}
        {tab === "weather" && <WeatherWidget city="Delhi" />}
        {tab === "marketplace" && <Marketplace />}
      </main>
    </div>
  );
};

export default Index;
