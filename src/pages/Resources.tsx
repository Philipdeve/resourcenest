import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// 📚 Import data from all subjects
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
  id: string;
  name: string;
  description: string;
  link: string;
  type: string;
  category: string; // Subject (e.g. Science, Engineering, Business)
  level: string; // Undergraduate | Masters | Postgraduate
  tags: string[];
}

const LEVEL_OPTIONS = ["All", "Undergraduate", "Masters", "Postgraduate"];

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read query params
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("discipline") || "All";

  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Combine all data files into one array
  const flattenResourceFile = (file: any): Resource[] => {
    if (!file) return [];
    if (Array.isArray(file)) return file as Resource[];
    const collected: any[] = [];
    const stack: any[] = [file];
    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      if (Array.isArray(current)) collected.push(...current);
      else if (typeof current === "object") {
        for (const value of Object.values(current)) stack.push(value);
      }
    }
    return collected as Resource[];
  };

  const allResources: Resource[] = [
    ...flattenResourceFile(scienceData),
    ...flattenResourceFile(techData),
    ...flattenResourceFile(engData),
    ...flattenResourceFile(mathsData),
    ...flattenResourceFile(medicineData),
    ...flattenResourceFile(educationData),
    ...flattenResourceFile(businessData),
    ...flattenResourceFile(artsData),
    ...flattenResourceFile(lawData),
    ...flattenResourceFile(computerData),
    ...flattenResourceFile(socialData),
  ].map((resource, index) => ({ ...resource, id: `resource-${index}` }));

  const [resources] = useState<Resource[]>(allResources);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  const categoryOptions = [
    "All",
    ...Array.from(new Set(allResources.map((r) => r.category))).sort(),
  ];

  // Authentication listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
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
    } catch (error) {
      console.error("Failed to load bookmarks", error);
    }
  };

  const handleBookmark = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to save your resources");
      navigate("/auth");
      return;
    }
    try {
      if (bookmarkedIds.has(id)) {
        const { error } = await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("resource_id", id);
        if (error) throw error;
        setBookmarkedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Removed from your library");
      } else {
        const { error } = await supabase.from("bookmarks").insert({ user_id: user.id, resource_id: id });
        if (error) throw error;
        setBookmarkedIds((prev) => new Set(prev).add(id));
        toast.success("Saved to your library!");
      }
    } catch (error) {
      toast.error("Unable to update saved resources");
    }
  };

  const handleShare = (link: string) => {
    const url = link;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesLevel = selectedLevel === "All" || resource.level?.toLowerCase() === selectedLevel.toLowerCase();
    const matchesCategory = selectedCategory === "All" || resource.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF] bg-clip-text text-transparent">
              Academic Resource Library
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore curated{" "}
            <span className="text-[#6C63FF] font-medium">academic</span> materials across{" "}
            <span className="text-[#FF6B6B] font-medium">all disciplines</span>.  
            Filter by subject, level, or keywords to find exactly what you need.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for resources, topics, or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          >
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          {LEVEL_OPTIONS.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              onClick={() => setSelectedLevel(level)}
              className={`rounded-full px-5 py-2 text-sm transition-all ${
                selectedLevel === level
                  ? "bg-[#FF6B6B] hover:bg-[#e05555] text-white border-none"
                  : "border border-gray-300 text-gray-700 hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
              }`}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              tags={resource.tags}
              name={resource.name}
              description={resource.description}
              category={resource.category}
              level={resource.level}
              type={resource.type as "pdf" | "video" | "article"}
              link={resource.link}
              isBookmarked={bookmarkedIds.has(resource.name)}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No matching resources found. Try a different search, subject, or level.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ResourceNest — Empowering Students to Learn Freely
      </footer>
    </div>
  );
}
