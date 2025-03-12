
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingTools } from "@/services/aiToolsService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft } from "lucide-react";

const TrendingPage = () => {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["trendingTools"],
    queryFn: fetchTrendingTools,
  });

  return (
    <div className="container py-8 px-4 md:px-6">
      <Button variant="ghost" className="mb-6 pl-0" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          Trending AI Tools
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore the most popular and fastest-growing AI tools right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array(8)
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
          : tools?.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>

      {tools && tools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No trending tools found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any trending tools at the moment.
          </p>
          <Button asChild>
            <Link to="/">Browse All Tools</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrendingPage;
