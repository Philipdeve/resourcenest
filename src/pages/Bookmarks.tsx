import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import { BookmarkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import scienceData from "../../data/science.json";
import techData from "../../data/technology.json";
import engData from "../../data/engineering.json";
import mathsData from "../../data/maths.json";
import medicineData from "../../data/medicine.json";
import educationData from "../../data/education.json";
import businessData from "../../data/business.json";
import artsData from "../../data/art.json";
import lawData from "../../data/law.json";
import computerData from "../../data/computer.json";
import socialData from "../../data/social.json";

interface Resource {
  name: string;
  description: string;
  link: string;
  type: string;
  category: string;
  tags: string[];
}

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const extractResources = (obj: any): Resource[] => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (typeof obj === "object") {
      return Object.values(obj).flatMap((v) => extractResources(v));
    }
    return [];
  };

  const allData = [
    ...extractResources(scienceData),
    ...extractResources(engData),
    ...extractResources(mathsData),
    ...extractResources(techData),
    ...extractResources(businessData),
    ...extractResources(artsData),
    ...extractResources(medicineData),
    ...extractResources(lawData),
    ...extractResources(educationData),
    ...extractResources(computerData),
    ...extractResources(socialData),
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchBookmarkedResources();
    }
  }, [user]);

  // const fetchBookmarkedResources = async () => {
  //   if (!user) return;

  //   try {
  //     const { data, error } = await supabase
  //       .from("bookmarks")
  //       .select("resource_id, resources(*)")
  //       .eq("user_id", user.id);

  //     if (error) throw error;
      
  //     const resources = data?.map((item: any) => item.resources).filter(Boolean) || [];
  //     setBookmarkedResources(resources);
  //   } catch (error: any) {
  //     toast.error("Failed to load bookmarks");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookmarkedResources = async () => {
  if (!user) return;

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("resource_id")
      .eq("user_id", user.id);

    if (error) throw error;

    const bookmarkedIds = data?.map((item: any) => item.resource_id) || [];

    // Filter allData to match only bookmarked ones
    const matchedResources = allData.filter((r) =>
      bookmarkedIds.includes(r.name)
    );

    setBookmarkedResources(matchedResources);
  } catch (error: any) {
    toast.error("Failed to load bookmarks");
  } finally {
    setLoading(false);
  }
};


  const handleRemoveBookmark = async (name: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", name);

      if (error) throw error;
      
      setBookmarkedResources((prev) => prev.filter((r) => r.name !== name));
      toast.success("Bookmark removed");
    } catch (error: any) {
      toast.error("Failed to remove bookmark");
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/resources`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 " >
          <h1 className="text-4xl font-bold  flex items-center gap-2 text-primary ">
            <BookmarkIcon className="h-8 w-8" />
            My Bookmarks
          </h1>
          <p className="my-2 mx-10">Your saved Academic resources</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        ) : bookmarkedResources.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">
              Start exploring resources and bookmark your favorites!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedResources.map((resource) => (
              <ResourceCard
                key={resource.name}
                {...resource}
                isBookmarked={true}
                onBookmark={handleRemoveBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
