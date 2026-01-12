import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoadingProfile } = useSupabaseAuth();

  // Note: We don't auto-redirect authenticated users after login
  // Customers should stay on the main site, admins can access /admin when needed
  // The redirect logic should be handled at the route level, not login level

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        // For new signups, redirect to the main site (not admin)
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password and try again.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-foreground mb-3">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? "Create an account to access exclusive listings"
              : "Sign in to access exclusive listings"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm uppercase tracking-wide text-muted-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-elegant w-full border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm uppercase tracking-wide text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-elegant w-full border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-outline h-14"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-primary hover:text-primary/80 transition-colors text-sm uppercase tracking-wide"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
