import { toast } from "sonner";

export interface ResourceClick {
  resource_name: string;
  resource_category: string;
  resource_type: string;
  clicked_at?: string;
}

export interface CategoryAnalytics {
  category: string;
  click_count: number;
  percentage: number;
}

const STORAGE_KEY = 'resourceNest_clicks';

export class ResourceTrackingService {
  /**
   * Track when a user clicks on a resource
   */
  static trackResourceClick(clickData: ResourceClick): void {
    try {
      const clicks = this.getStoredClicks();
      const newClick = {
        ...clickData,
        clicked_at: new Date().toISOString(),
      };
      
      clicks.push(newClick);
      
      // Keep only the last 1000 clicks to prevent localStorage from getting too large
      const trimmedClicks = clicks.slice(-1000);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedClicks));
    } catch (error) {
      toast.error("Failed to track resource interaction");
    }
  }

  /**
   * Get all stored clicks from localStorage
   */
  private static getStoredClicks(): ResourceClick[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      toast.error("Failed to load tracking data");
      return [];
    }
  }

  /**
   * Get user's favorite categories based on click history
   */
  static getUserFavoriteCategories(): CategoryAnalytics[] {
    try {
      const clicks = this.getStoredClicks();
      
      if (clicks.length === 0) {
        return [];
      }

      // Count clicks by category
      const categoryCounts: Record<string, number> = {};
      clicks.forEach(click => {
        categoryCounts[click.resource_category] = (categoryCounts[click.resource_category] || 0) + 1;
      });

      const totalClicks = clicks.length;
      
      // Convert to analytics format
      const analytics: CategoryAnalytics[] = Object.entries(categoryCounts)
        .map(([category, click_count]) => ({
          category,
          click_count,
          percentage: Math.round((click_count / totalClicks) * 100 * 100) / 100, // Round to 2 decimal places
        }))
        .sort((a, b) => b.click_count - a.click_count);

      return analytics;
    } catch (error) {
      toast.error("Failed to load category analytics");
      return [];
    }
  }

  /**
   * Get user's total click count
   */
  static getUserTotalClicks(): number {
    try {
      const clicks = this.getStoredClicks();
      return clicks.length;
    } catch (error) {
      toast.error("Failed to load click count");
      return 0;
    }
  }

  /**
   * Get user's recent activity (last 10 clicks)
   */
  static getUserRecentActivity(): ResourceClick[] {
    try {
      const clicks = this.getStoredClicks();
      
      // Sort by clicked_at descending and take the last 10
      return clicks
        .sort((a, b) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime())
        .slice(0, 10);
    } catch (error) {
      toast.error("Failed to load recent activity");
      return [];
    }
  }

  /**
   * Clear all tracking data (useful for testing or privacy)
   */
  static clearTrackingData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      toast.error("Failed to clear tracking data");
    }
  }
}
