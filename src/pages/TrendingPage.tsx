import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AITool } from "@/services/aiToolsService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { origins, countries } from "@/config/site";
import ToolFilters from "@/components/ToolFilters";
import { trendingToolsPrompt } from "@/config/prompts";
import CategoryIcon from "@/components/CategoryIcon";

const TrendingPage = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const navigate = useNavigate();

  const fetchTrendingToolsFromAI = async () => {
    setIsLoading(true);
    try {
      const prompt = trendingToolsPrompt(countryFilter);
      const aiResponse = await window.puter.ai.chat(prompt);
      const responseText = typeof aiResponse === "object" && aiResponse.message
        ? aiResponse.message.content
        : String(aiResponse);
      const toolsData = eval(responseText);
      console.log(toolsData);
      setTools(toolsData);
      localStorage.setItem("trendingTools", JSON.stringify(toolsData));
      localStorage.setItem("trendingToolsTimestamp", Date.now().toString());
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch trending tools from AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedTools = localStorage.getItem("trendingTools");
    const storedTimestamp = localStorage.getItem("trendingToolsTimestamp");
    const fiveHours = 5 * 60 * 60 * 1000;

    if (storedTools && storedTimestamp && Date.now() - parseInt(storedTimestamp) < fiveHours) {
      setTools(JSON.parse(storedTools));
      setIsLoading(false);
    } else {
      fetchTrendingToolsFromAI();
    }
  }, []);

  const handleToolClick = (tool: AITool, relatedTools: AITool[] = []) => {
    navigate(`/tool/${tool.id}`, { state: { tool, relatedTools } });
  };

  const handleReload = () => {
    fetchTrendingToolsFromAI();
  };

  const handleFilterChange = () => {
    fetchTrendingToolsFromAI();
  };

  const filteredTools = tools.filter(tool => {
    if (countryFilter && countryFilter !== "all" && tool.origin !== countryFilter) {
      return false;
    }
    if (originFilter && originFilter !== "all" && tool.company !== originFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" className="pl-0" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" onClick={handleReload}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload
        </Button>
      </div>

      <ToolFilters
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        originFilter={originFilter}
        setOriginFilter={setOriginFilter}
        onFilterChange={handleFilterChange}
      />

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
          : filteredTools?.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={(t) => handleToolClick(t, tools)} />
            ))}
      </div>

      {!isLoading && filteredTools.length === 0 && (
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
