import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 gradient-hero px-4 py-2 rounded-full mb-4">
            <Sprout className="h-6 w-6 text-primary-foreground" />
            <span className="text-primary-foreground font-bold text-lg font-display">AgriSmart</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Join AgriSmart today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Name
              </label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required={!isLogin} />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Email
            </label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Password
            </label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-hero text-primary-foreground font-semibold">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
