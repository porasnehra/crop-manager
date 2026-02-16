import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, MapPin, Phone, Package, IndianRupee, ShoppingCart, X } from "lucide-react";

interface Listing {
  id: string;
  user_id: string;
  crop_name: string;
  quantity: string;
  price_per_unit: number;
  unit: string;
  location: string;
  description: string;
  contact_phone: string;
  is_active: boolean;
  created_at: string;
  profiles?: { name: string; phone: string } | null;
}

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    crop_name: "", quantity: "", price_per_unit: "", unit: "kg",
    location: "", description: "", contact_phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketplace_listings" as any)
      .select("*, profiles:user_id(name, phone)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    
    if (!error && data) setListings(data as any);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.from("marketplace_listings" as any).insert({
      user_id: user.id,
      crop_name: formData.crop_name,
      quantity: formData.quantity,
      price_per_unit: parseFloat(formData.price_per_unit),
      unit: formData.unit,
      location: formData.location,
      description: formData.description,
      contact_phone: formData.contact_phone,
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Listing created!", description: "Your crop listing is now live." });
      setShowForm(false);
      setFormData({ crop_name: "", quantity: "", price_per_unit: "", unit: "kg", location: "", description: "", contact_phone: "" });
      fetchListings();
    }
    setSubmitting(false);
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("marketplace_listings" as any).delete().eq("id", id);
    if (!error) {
      toast({ title: "Deleted", description: "Listing removed." });
      fetchListings();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">🛒 Marketplace</h2>
          <p className="text-muted-foreground text-sm">Buy and sell crops directly — no middleman</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-hero text-primary-foreground">
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Sell Crop"}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4 animate-fade-in">
          <h3 className="font-semibold text-foreground">List Your Crop for Sale</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Crop Name</label>
              <Input value={formData.crop_name} onChange={e => setFormData(p => ({ ...p, crop_name: e.target.value }))} placeholder="e.g. Wheat, Rice" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <Input value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 500 kg" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Price per unit (₹)</label>
              <Input type="number" value={formData.price_per_unit} onChange={e => setFormData(p => ({ ...p, price_per_unit: e.target.value }))} placeholder="e.g. 25" required min="1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Unit</label>
              <Input value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))} placeholder="kg / quintal / ton" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Village, District, State" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Contact Phone</label>
              <Input value={formData.contact_phone} onChange={e => setFormData(p => ({ ...p, contact_phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description (optional)</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Quality details, harvest date, etc." rows={2} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full gradient-hero text-primary-foreground font-semibold">
            {submitting ? "Publishing..." : "Publish Listing"}
          </Button>
        </form>
      )}

      {/* Listings */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/2 mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No listings yet. Be the first to sell!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map(listing => (
            <div key={listing.id} className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{listing.crop_name}</h3>
                  <p className="text-xs text-muted-foreground">
                    by {(listing.profiles as any)?.name || "Farmer"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary flex items-center gap-0.5">
                    <IndianRupee className="h-4 w-4" />{listing.price_per_unit}/{listing.unit}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-3.5 w-3.5 text-primary" /> {listing.quantity}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {listing.location}
                </p>
                {listing.contact_phone && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" /> {listing.contact_phone}
                  </p>
                )}
              </div>

              {listing.description && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">{listing.description}</p>
              )}

              {user?.id === listing.user_id && (
                <Button variant="outline" size="sm" className="mt-3 text-destructive" onClick={() => deleteListing(listing.id)}>
                  Remove Listing
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
