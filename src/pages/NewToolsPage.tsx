import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AITool } from "@/services/aiToolsService";
import { newToolsPrompt } from "@/config/prompts";
import ToolFilters from "@/components/ToolFilters";

const NewToolsPage = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const navigate = useNavigate();

  const fetchNewToolsFromAI = async () => {
    setIsLoading(true);
    try {
      let prompt = newToolsPrompt(countryFilter);
      if (countryFilter) {
        prompt += ` from ${countryFilter}`;
      }
      prompt += `. Please ensure your response spans a diverse range of categories such as coding assistants, design tools, automation, productivity, and data analytics. For each tool, gather and include comprehensive details including:
- Primary use case and target audience.`;

      const aiResponse = await window.puter.ai.chat(prompt);
      const responseText = typeof aiResponse === "object" && aiResponse.message
        ? aiResponse.message.content
        : String(aiResponse);
      const toolsData = eval(responseText);
      console.log(toolsData);
      setTools(toolsData);
      localStorage.setItem("newTools", JSON.stringify(toolsData));
      localStorage.setItem("newToolsTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Failed to fetch new tools from AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedTools = localStorage.getItem("newTools");
    const storedTimestamp = localStorage.getItem("newToolsTimestamp");
    const fiveHours = 5 * 60 * 60 * 1000;

    if (storedTools && storedTimestamp && Date.now() - parseInt(storedTimestamp) < fiveHours) {
      setTools(JSON.parse(storedTools));
      setIsLoading(false);
    } else {
      fetchNewToolsFromAI();
    }
  }, []);

  const handleToolClick = (tool: AITool, relatedTools: AITool[] = []) => {
    navigate(`/tool/${tool.id}`, { state: { tool, relatedTools } });
  };

  const handleReload = () => {
    fetchNewToolsFromAI();
  };

  const handleFilterChange = () => {
    fetchNewToolsFromAI();
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
          Newly Added AI Tools
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Discover the latest AI tools that have been added to our directory in the past week.
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

      {tools && tools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No new tools found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any new tools added in the past week.
          </p>
          <Button asChild>
            <Link to="/">Browse All Tools</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewToolsPage;
