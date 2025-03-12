import { AITool } from "@/services/aiToolsService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ToolCardProps {
  tool: AITool;
  featured?: boolean;
  onClick: (tool: AITool) => void;
}

export default function ToolCard({ tool, featured = false, onClick }: ToolCardProps) {
  const dateAdded = new Date(tool.dateAdded);
  const isNew = new Date().getTime() - dateAdded.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div onClick={() => onClick(tool)}>
      <Link to={`/tool/${tool.id}`} state={{ tool }}>
        <Card 
          className={cn(
            "overflow-hidden card-hover h-full",
            featured && "border-primary/50"
          )}
        >
          <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
            <img 
              src={tool.logoUrl} 
              alt={tool.name} 
              className="object-cover w-full h-full"
            />
            {featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              </div>
            )}
            {tool.trending && !featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">Trending</Badge>
              </div>
            )}
            {isNew && !tool.trending && !featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-background/80">New</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-lg leading-tight line-clamp-1">{tool.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
            <div className="flex flex-wrap gap-1 mt-auto">
              <Badge variant="outline" className="text-xs">
                {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
              </Badge>
              {tool.pricing && (
                <Badge variant="secondary" className="text-xs">
                  {tool.pricing}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border mt-auto">
            <div className="text-xs text-muted-foreground">
              {tool.company}
            </div>
            <div className="text-xs text-muted-foreground">
              {dateAdded.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
