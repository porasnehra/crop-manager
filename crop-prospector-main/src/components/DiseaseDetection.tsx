import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Leaf, AlertTriangle, Shield, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiseaseResult {
  disease_name: string;
  confidence: string;
  crop_name: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please use an image under 5MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("detect-disease", {
        body: { imageBase64 },
      });
      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const confidenceConfig: Record<string, { icon: any; className: string }> = {
    High: { icon: Shield, className: "text-success" },
    Medium: { icon: ShieldAlert, className: "text-warning" },
    Low: { icon: AlertTriangle, className: "text-destructive" },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">🔬 Disease Detection</h2>
        <p className="text-muted-foreground text-sm mt-1">Upload a photo of your crop leaf to identify diseases</p>
      </div>

      {/* Upload area */}
      <div
        className="bg-card border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {image ? (
          <img src={image} alt="Uploaded leaf" className="max-h-64 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="space-y-3">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Click to upload or take a photo</p>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG (max 5MB)</p>
          </div>
        )}
      </div>

      {image && (
        <Button onClick={analyze} disabled={loading} className="w-full gradient-hero text-primary-foreground font-semibold py-5">
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
          ) : (
            <><Leaf className="mr-2 h-5 w-5" /> Analyze for Diseases</>
          )}
        </Button>
      )}

      {/* Result */}
      {result && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-card animate-fade-in space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{result.disease_name}</h3>
              <p className="text-sm text-muted-foreground">Crop: {result.crop_name}</p>
            </div>
            {(() => {
              const conf = confidenceConfig[result.confidence] || confidenceConfig.Low;
              const Icon = conf.icon;
              return (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${conf.className} bg-secondary`}>
                  <Icon className="h-3 w-3" /> {result.confidence} Confidence
                </span>
              );
            })()}
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Symptoms</p>
              <p className="text-muted-foreground">{result.symptoms}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">💊 Treatment</p>
              <p className="text-muted-foreground">{result.treatment}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">🛡️ Prevention</p>
              <p className="text-muted-foreground">{result.prevention}</p>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => { setImage(null); setImageBase64(null); setResult(null); }}>
            Scan Another Leaf
          </Button>
        </div>
      )}
    </div>
  );
}
