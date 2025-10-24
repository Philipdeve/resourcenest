import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Clock, BookOpen } from "lucide-react";
import {
  ResourceTrackingService,
  CategoryAnalytics,
} from "@/services/resourceTracking";

interface ResourceAnalyticsProps {
  className?: string;
}

const ResourceAnalytics = ({ className = "" }: ResourceAnalyticsProps) => {
  const [favoriteCategories, setFavoriteCategories] = useState<
    CategoryAnalytics[]
  >([]);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = () => {
      try {
        const categories = ResourceTrackingService.getUserFavoriteCategories();
        const clicks = ResourceTrackingService.getUserTotalClicks();
        const activity = ResourceTrackingService.getUserRecentActivity();

        setFavoriteCategories(categories);
        setTotalClicks(clicks);
        setRecentActivity(activity);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      "arts & humanities": "Arts & Humanities",
      "computer science": "Computer Science",
      "health and medicine": "Health & Medicine",
      "law and governance": "Law & Governance",
      "social science": "Social Sciences",
      business: "Business & Management",
      engineering: "Engineering",
      education: "Education",
      science: "Science",
      mathematics: "Mathematics",
      technology: "Technology",
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  const getMotivationalMessage = () => {
    if (favoriteCategories.length === 0) {
      return "Start exploring resources to discover your interests!";
    }

    const topCategory = favoriteCategories[0];
    const categoryName = getCategoryDisplayName(topCategory.category);

    if (topCategory.percentage >= 50) {
      return `You seem to love ${categoryName}! 🎯`;
    } else if (topCategory.percentage >= 30) {
      return `You're really into ${categoryName}! 📚`;
    } else {
      return `You enjoy exploring ${categoryName}! 🔍`;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#6C63FF]/10 border border-[#FF6B6B]/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#FF6B6B]" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {getMotivationalMessage()}
              </h3>
              <p className="text-gray-600 text-sm">
                Based on your {totalClicks} resource interactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Categories */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Your Interests
          </CardTitle>
          <BarChart3 className="h-5 w-5 text-[#6C63FF]" />
        </CardHeader>
        <CardContent>
          {favoriteCategories.length > 0 ? (
            <div className="space-y-3">
              {favoriteCategories.slice(0, 5).map((category, index) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`${
                        index === 0
                          ? "bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]"
                          : "bg-[#6C63FF]/10 border-[#6C63FF]/30 text-[#6C63FF]"
                      }`}
                    >
                      {getCategoryDisplayName(category.category)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {category.click_count} clicks
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No resource interactions yet. Start exploring to see your
                interests!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Recent Activity
            </CardTitle>
            <Clock className="h-5 w-5 text-[#FF6B6B]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">
                     
                      {activity.resource_name.length > 20
                        ? `${activity.resource_name.substring(0, 30)}...`
                        : activity.resource_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-50 border-gray-200"
                      >
                        {getCategoryDisplayName(activity.resource_category)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-50 border-gray-200"
                      >
                        {activity.resource_type}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs ml-2">
                    {new Date(activity.clicked_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceAnalytics;
