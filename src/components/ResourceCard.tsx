import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, FileText, Share2, Video } from "lucide-react";
import { useState } from "react";

interface ResourceCardProps {
   name: string;
  description: string;
  link: string;
  type: string;
  category: string;
  tags: string[];
  isBookmarked?: boolean;
  onBookmark?: (name: string) => void;
  onShare?: (id: string) => void;
}

const ResourceCard = ({
  
  name,
  description,
  link,
  type,
  category,
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

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            {type === "pdf" ? <FileText className="h-3 w-3" /> : <Video className="h-3 w-3" />}
            {type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="outline">{category}</Badge>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <a href={link} target="_blank" rel="noopener noreferrer">
            View Resource
          </a>
        </Button>
        <Button
          variant={bookmarked ? "default" : "outline"}
          size="icon"
          onClick={handleBookmark}
        >
          <BookmarkIcon className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onShare?.(name)}>
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
