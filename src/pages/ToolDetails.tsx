
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchToolById, fetchToolsByCategory } from "@/services/aiToolsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ExternalLink, ArrowLeft } from "lucide-react";

const ToolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tool, isLoading, isError } = useQuery({
    queryKey: ["tool", id],
    queryFn: () => fetchToolById(id || ""),
    enabled: !!id,
  });

  const { data: relatedTools, isLoading: isRelatedLoading } = useQuery({
    queryKey: ["relatedTools", tool?.category],
    queryFn: () => fetchToolsByCategory(tool?.category || ""),
    enabled: !!tool?.category,
  });

  useEffect(() => {
    if (isError) {
      navigate("/not-found", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mb-6" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return null;
  }

  // Filter out the current tool from related tools
  const filteredRelatedTools = relatedTools?.filter(relatedTool => relatedTool.id !== tool.id) || [];

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="rounded-lg overflow-hidden bg-secondary w-24 h-24 flex-shrink-0">
              <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">{tool.name}</h1>
              <div className="text-muted-foreground">{tool.company}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>
                  {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                </Badge>
                {tool.pricing && (
                  <Badge variant="secondary">{tool.pricing}</Badge>
                )}
                {tool.origin && (
                  <Badge variant="outline">
                    <Link to={`/origin/${tool.origin}`}>{tool.origin}</Link>
                  </Badge>
                )}
                {tool.trending && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Trending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-lg">{tool.description}</p>
            <p>
              This is an expanded description of the tool with more details about its features, functionality, and benefits.
              In a real implementation, this would come from your database or API.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button asChild>
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="secondary">
              Share
            </Button>
            <Button variant="outline">
              Report Issue
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-3">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-primary mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Feature 1: Description of the first main feature
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-primary mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Feature 2: Description of the second main feature
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 text-primary mt-1"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Feature 3: Description of the third main feature
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-3">Additional Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Added</span>
                  <span>
                    {new Date(tool.dateAdded).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>
                    {new Date(tool.updated).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pricing</span>
                  <span>{tool.pricing || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin</span>
                  <span>{tool.origin || "Not specified"}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {filteredRelatedTools.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isRelatedLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="space-y-3">
                        <Skeleton className="h-[200px] w-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))
                : filteredRelatedTools
                    .slice(0, 3)
                    .map((relatedTool) => (
                      <ToolCard key={relatedTool.id} tool={relatedTool} />
                    ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetails;
