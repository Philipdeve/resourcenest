import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftCircle, User } from "lucide-react";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await (supabase as any)
        .from("users")
        .select("name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatar(data.avatar_url || "");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await (supabase as any)
      .from("users")
      .upsert({
        id: user?.id,
        name,
        bio,
        avatar_url: avatar,
        updated_at: new Date(),
      });

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF] text-white py-14 text-center relative">
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-5 left-5 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeftCircle className="h-7 w-7" />
        </button>
        <User className="mx-auto h-16 w-16 mb-3 opacity-90" />
        <h1 className="text-4xl font-bold">Edit Profile</h1>
        <p className="text-white/80 text-lg mt-2">
          Update your personal information and customize your profile.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={
                  avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${name || "User"}`
                }
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full border-4 border-[#6C63FF]/40 shadow-sm object-cover"
              />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="rounded-xl focus:ring-2 focus:ring-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio about yourself"
                className="rounded-xl focus:ring-2 focus:ring-[#6C63FF] min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste your avatar image link (optional)"
                className="rounded-xl focus:ring-2 focus:ring-[#6C63FF]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: You can use a hosted image link from services like Cloudinary or Imgur.
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full bg-[#6C63FF] hover:bg-[#5848d9] text-white rounded-2xl font-semibold py-3 transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-10">
          © {new Date().getFullYear()} ResourceNest — Empowering Learners
        </p>
      </main>
    </div>
  );
}
