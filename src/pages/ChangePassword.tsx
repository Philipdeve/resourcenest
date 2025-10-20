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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    // Check if user is authenticated before changing password
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to change your password");
        navigate("/auth");
        return;
      }
      
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.info("Your password has been reset successfully.");
      navigate("/auth");
    }
    setLoading(false);
  };



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
            <CardDescription>Change Password</CardDescription>
          </CardHeader>

          <CardContent>
            
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <Label htmlFor="signin-email">Enter New Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="signin-p">Confirm Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </Button>
                </form>
           
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
