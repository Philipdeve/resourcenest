import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Edit, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Resource {
  id: string;
  title: string;
}

interface Activity {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [resourcesCount, setResourcesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      // Fetch custom profile info
      const { data: profileData } = await (supabase as any)
        .from("users")
        .select("name, bio, avatar_url")
        .eq("auth_user_id", user.id)
        .single();

      setProfile(profileData);
     

      // Count saved resources
      const { count } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact"})
        .eq("user_id", user.id);
      

      setResourcesCount(count || 0);

      // Fetch user activity logs
      // const { data: activityData, error } = await (supabase as any)
      //   .from("activities")
      //   .select("id, action, details, created_at")
      //   .eq("user_id", user.id)
      //   .order("created_at", { ascending: false })
      //   .limit(5);

      // if (error) console.error(error);
      // setActivities((activityData as Activity[]) || []);

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-4xl py-10 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#6C63FF] mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-6 mb-10 ">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${
                  profile?.name
                }`
              }
            />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.name || user.email}
            </h1>
            <p className="text-gray-500">
              {profile?.bio || "Welcome to your ResourceNest profile!"}
            </p>
          </div>

          <Link
            to="/edit-profile"
            className="ml-auto text-sm text-[#6C63FF] hover:underline hidden lg:flex items-center gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </Link>
        </div>
        <Link
          to="/edit-profile"
          className="ml-auto text-sm text-[#6C63FF] hover:underline flex items-center gap-1 lg:hidden my-2"
        >
          <Edit className="h-4 w-4" /> Edit Profile
        </Link>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Saved Resources
              </CardTitle>
              <BookOpen className="h-5 w-5 text-[#6C63FF]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#6C63FF]">
                {resourcesCount}
              </p>
              <p className="text-sm text-gray-500">Total resources saved</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Recent Activity
              </CardTitle>
              <Clock className="h-5 w-5 text-[#FF6B6B]" />
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ul className="space-y-2">
                  {activities.map((act) => (
                    <li key={act.id} className="text-gray-700 text-sm">
                      <span className="font-medium text-[#6C63FF]">
                        {act.action}
                      </span>{" "}
                      — {act.details}
                      <p className="text-gray-500 text-xs">
                        {new Date(act.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No recent activities yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
