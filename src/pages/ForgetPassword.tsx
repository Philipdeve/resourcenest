import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/change-password`,
    });

    if (error) {
      toast("can't reset Password. Try again in few seconds");
      // Return null because we don't want to sign in the user yet
      return null;
    } else {
      toast.info("Password reset link has been sent to your email.");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/resources");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/resources");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B]/10 via-white to-[#6C63FF]/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-3xl font-bold"
          >
            <BookOpen className="h-8 w-8 text-[#FF6B6B]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF]">
              ResourceNest
            </span>
          </Link>
          <p className="text-gray-500 mt-1">
            Navigate Your Academic Journey with Ease
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Recover your Account
            </CardTitle>
            <CardDescription>
              Please enter your email address to get a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin">
              <TabsContent value="signin">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                    />
                  </div>

                  <Button type="submit" className="w-full py-3">
                    Send reset link
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <p className="text-center text-gray-500 mt-4 text-sm">
          Back to{" "}
          <Link to="/" className="text-[#FF6B6B] font-medium">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
