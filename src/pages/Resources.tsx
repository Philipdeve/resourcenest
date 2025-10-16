import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import scienceData from "../../data/science.json";
import techData from "../../data/technology.json";
import engData from "../../data/engineering.json";
import mathsData from "../../data/maths.json";


const CATEGORIES = ["All", "Mathematics", "Science", "Technology", "Engineering"];

interface Resource {
  name: string;
  description: string;
  link: string;
  type: string;
  category: string;
  tags: string[];
}

const Resources = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources] = useState<Resource[]>(() => {
  const allData = [
    ...scienceData,
    ...engData, 
    ...mathsData,
    ...techData,
  ];

  return allData.map((resource, index) => ({
    ...resource,
    id: `resource-${index}`,
  }));
});
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("resource_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setBookmarkedIds(new Set(data?.map((b) => b.resource_id) || []));
    } catch (error: any) {
      console.error("Failed to load bookmarks", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" ||
      resource.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleBookmark = async (name: string) => {
    if (!user) {
      toast.error("Please sign in to bookmark resources");
      navigate("/auth");
      return;
    }

    try {
      if (bookmarkedIds.has(name)) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("resource_id", name);

        if (error) throw error;
        setBookmarkedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(name);
          return newSet;
        });
        toast.success("Bookmark removed");
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, resource_id: name });

        if (error) throw error;
        setBookmarkedIds((prev) => new Set(prev).add(name));
        toast.success("Resource bookmarked!");
      }
    } catch (error: any) {
      toast.error("Failed to update bookmark");
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">STEM Resources</h1>
          <p className="text-muted-foreground">
            Explore our collection of educational materials
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.name}
              tags={resource.tags}
              name={resource.name}
              description={resource.description}
              category={resource.category}
              type={resource.type as "pdf" | "video"}
              link={resource.link}
              isBookmarked={bookmarkedIds.has(resource.name)}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No resources found. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
