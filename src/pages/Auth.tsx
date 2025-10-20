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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectUrl = import.meta.env.SUPABASE_REDIRECT_URL;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${redirectUrl}` },
      });
      if (error) throw error;

      const { error: profileError } = await supabase.from("users").insert([
        {
          auth_user_id: data.user?.id, 
          name, 
          bio: "", 
          avatar_url: "",
          updated_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        toast.error("Failed to create user profile: " + profileError.message);
        return;
      }
      toast.success("Account created! Check your email to verify.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Logged in successfully!");
      navigate("/resources");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to access exclusive resources
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="signin" className="rounded-lg">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Form */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-1">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#FF6B6B]/50 focus:border-[#FF6B6B]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="justify-end flex">
                    <Link
                      to={"/forget-password"}
                      className="text-sm text-primary"
                    >
                      Forgotten Password?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-1">
                    <Label htmlFor="signup-email">Name</Label>
                    <Input
                      id="signup-email"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="border-gray-300 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
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
