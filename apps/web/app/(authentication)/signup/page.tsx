"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Hexagon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGitHubSignIn = () => {
    console.log("GitHub sign-in clicked");
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    console.log("User created:", data);

    // If email confirmation is enabled, session will be null
    if (!data.session) {
      alert("Check your email to confirm your account");
      setLoading(false);
      return;
    }

    // Redirect after successful signup
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) return;

    try {
      await signUp(email, password);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">

      {/* 🌫️ Ambient gradient (global) */}
      <div className="fixed inset-0 pointer-events-none z-0 
      bg-[radial-gradient(ellipse_at_20%_0%,rgba(168,85,247,0.12),transparent_60%)] 
      blur-2xl"
      />
      <div className="fixed inset-0 pointer-events-none z-0 
      bg-[radial-gradient(ellipse_at_80%_30%,rgba(139,92,246,0.10),transparent_65%)] 
      blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">

          <CardHeader className="pb-4">
            {/* 🔥 Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Hexagon className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                PingShield
              </span>
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              Create your account
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Monitor your endpoints with confidence.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full text-sm font-medium bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleGitHubSignIn}
                type="button"
              >
                GitHub
              </Button>

              <Button
                variant="outline"
                className="w-full text-sm font-medium bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleGoogleSignIn}
                type="button"
              >
                Google
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-white/10" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                or continue with email
              </span>
              <Separator className="flex-1 bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-white/5 border-white/10 focus:border-purple-500 focus:ring-purple-500/30"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    required
                    className="pr-10 bg-white/5 border-white/10 focus:border-purple-500 focus:ring-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 text-white shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our Terms and Privacy Policy.
            </p>
          </CardContent>

          <CardFooter className="border-t border-white/10 pt-4 flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/sign-in" className="font-medium text-white hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}