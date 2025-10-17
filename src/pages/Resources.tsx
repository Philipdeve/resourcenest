import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import medicineData from "../../data/medicine.json";
import educationData from "../../data/education.json";
import businessData from "../../data/business.json";
import artsData from "../../data/art.json";
import lawData from "../../data/law.json";
import computerData from "../../data/computer.json";
import socialData from "../../data/social.json";

const CATEGORIES = ["All", "Undergraduate", "Masters", "Postgraduate"];

interface Resource {
  id: string;
  name: string;
  description: string;
  link: string;
  type: string;
  category: string;
  tags: string[];
  discipline?: string; // Added to map to discipline buttons
}

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources] = useState<Resource[]>(() => {
    const extractResources = (data: any, discipline: string): Resource[] => {
      if (Array.isArray(data)) return data.map((r) => ({ ...r, discipline }));
      if (!data || typeof data !== "object") return [];
      return Object.entries(data).flatMap(([_, value]) =>
        extractResources(value, discipline)
      );
    };

    return [
      ...extractResources(scienceData, "science"),
      ...extractResources(engData, "engineering"),
      ...extractResources(mathsData, "maths"),
      ...extractResources(techData, "technology"),
      ...extractResources(businessData, "business"),
      ...extractResources(artsData, "arts"),
      ...extractResources(medicineData, "medicine"),
      ...extractResources(lawData, "law"),
      ...extractResources(educationData, "education"),
      ...extractResources(computerData, "computer"),
      ...extractResources(socialData, "social"),
    ].map((resource, index) => ({ ...resource, id: `resource-${index}` }));
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  // Get discipline query from URL
  const searchParams = new URLSearchParams(location.search);
  const disciplineQuery = searchParams.get("discipline");

  // Handle authentication
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
    if (user) fetchBookmarks();
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

    const matchesDiscipline =
      !disciplineQuery || resource.discipline === disciplineQuery;

    return matchesCategory && matchesSearch && matchesDiscipline;
  });

  const handleBookmark = async (name: string) => {
    if (!user) {
      toast.error("Please sign in to save your resources");
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
        toast.success("Removed from your library");
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, resource_id: name });

        if (error) throw error;
        setBookmarkedIds((prev) => new Set(prev).add(name));
        toast.success("Saved to your library!");
      }
    } catch (error: any) {
      toast.error("Unable to update saved resources");
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/resources`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF] bg-clip-text text-transparent">
              ResourceNest Library
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Navigate your academic journey with ease. Explore curated{" "}
            <span className="text-[#FF6B6B] font-medium">University,</span>{" "}
            <span className="text-[#FF6B6B] font-medium">Masters</span> and{" "}
            <span className="text-[#6C63FF] font-medium">Postgraduate’s</span>{" "}
            learning materials, research papers, and study guides shared by the community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for resources, courses, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? "bg-[#FF6B6B] hover:bg-[#e05555] text-white border-none"
                  : "border border-gray-300 text-gray-700 hover:border-[#6C63FF] hover:text-[#6C63FF]"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
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

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No matching resources found. Try a different search, category, or discipline.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ResourceNest — Empowering Students to Learn Freely
      </footer>
    </div>
  );
}
