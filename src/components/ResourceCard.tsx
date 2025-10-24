import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, FileText, Share2, Video, Newspaper } from "lucide-react";
import { useState } from "react";
import { ResourceTrackingService } from "@/services/resourceTracking";

interface ResourceCardProps {
  name: string;
  description: string;
  link: string;
  type: string;
  category: string; // Field (e.g., "law and governance")
  level?: string; // New field (e.g., "Undergraduate", "Masters", "Postgraduate")
  tags: string[];
  isBookmarked?: boolean;
  onBookmark?: (name: string) => void;
  onShare?: (link: string) => void;
}

const ResourceCard = ({
  name,
  description,
  link,
  type,
  category,
  level,
  tags,
  isBookmarked = false,
  onBookmark,
  onShare,
}: ResourceCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(name);
  };

  const handleViewResource = () => {
    // Track the resource click
    ResourceTrackingService.trackResourceClick({
      resource_name: name,
      resource_category: category,
      resource_type: type,
    });
  };

  return (
    <Card className="bg-gradient-to-b from-white to-[#f9f9ff] border border-gray-200 shadow-sm hover:shadow-lg transition-all rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {name}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 line-clamp-2">
              {description}
            </CardDescription>
          </div>

          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-[#F3F0FF] text-[#6C63FF] border-none"
          >
            {type === "pdf" ? (
              <FileText className="h-3 w-3" />
            ) : type === "article" ? (
              <Newspaper className="h-3 w-3" />
            ) : (
              <Video className="h-3 w-3" />
            )}
            {type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border border-[#6C63FF]/30 text-[#6C63FF] bg-[#F9F8FF]"
          >
            {category}
          </Badge>

          {level && (
            <Badge
              variant="outline"
              className="border border-[#FF6B6B]/30 text-[#FF6B6B] bg-[#FFF8F8]"
            >
              {level}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 mt-2">
        {/* View Button */}
        <Button
          asChild
          className="flex-1 bg-gradient-to-r from-[#6C63FF] to-[#FF6B6B] text-white font-medium rounded-full hover:opacity-90 transition-all"
        >
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleViewResource}
          >
            View Resource
          </a>
        </Button>

        {/* Bookmark Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleBookmark}
          className={`rounded-full border ${
            bookmarked
              ? "bg-gradient-to-r from-[#6C63FF] to-[#FF6B6B] text-white"
              : "border-gray-300 text-gray-600 hover:border-[#6C63FF]/60 hover:text-[#6C63FF]"
          } transition-all`}
        >
          <BookmarkIcon
            className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
          />
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onShare?.(link)}
          className="rounded-full border border-gray-300 text-gray-600 hover:border-[#FF6B6B]/60 hover:text-[#FF6B6B] transition-all"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
