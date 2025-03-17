import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Category, fetchCategories } from "@/services/aiToolsService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AITool } from "@/services/aiToolsService";
import { categoryToolsPrompt } from "@/config/prompts";
import { useQuery } from "@tanstack/react-query";
import { origins, countries, categoryIcons } from "@/config/site";
import ToolFilters from "@/components/ToolFilters";
import CategoryIcon from "@/components/CategoryIcon";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleToolClick = (tool: AITool, relatedTools: AITool[] = []) => {
    navigate(`/tool/${tool.id}`, { state: { tool, relatedTools } });
  };

  const category = categoriesData?.find((c) => c.id === id);

  const fetchCategoryToolsFromAI = async () => {
    setIsLoading(true);
    try {
      if (!category) return;

      const prompt = categoryToolsPrompt(category.name, countryFilter);

      const aiResponse = await window.puter.ai.chat(prompt);
      const responseText =
        typeof aiResponse === "object" && aiResponse.message
          ? aiResponse.message.content
          : String(aiResponse);
      const toolsData = eval(responseText);
      console.log(toolsData);
      setTools(toolsData);
      localStorage.setItem(`categoryTools-${id}`, JSON.stringify(toolsData));
      localStorage.setItem(`categoryToolsTimestamp-${id}`, Date.now().toString());
    } catch (error) {
      console.error("Failed to fetch category tools from AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadStoredTools = () => {
      const storedTools = localStorage.getItem(`categoryTools-${id}`);
      const storedTimestamp = localStorage.getItem(`categoryToolsTimestamp-${id}`);
      const fiveHours = 5 * 60 * 60 * 1000;

      if (storedTools && storedTimestamp && Date.now() - parseInt(storedTimestamp) < fiveHours) {
        setTools(JSON.parse(storedTools));
        setIsLoading(false);
      } else {
        fetchCategoryToolsFromAI();
      }
    };

    if (category) {
      loadStoredTools();
    }
  }, [category, id]);

  const handleReload = () => {
    fetchCategoryToolsFromAI();
  };

  const handleFilterChange = () => {
    fetchCategoryToolsFromAI();
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

      {category ? (
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            {category.name} Tools
          </h1>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CategoryIcon name={category.name} />
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            {category.description}
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
      )}

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
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool, tools)}
              />
            ))}
      </div>

      {tools && tools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No tools found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any tools in this category.
          </p>
          <Button asChild>
            <Link to="/">Browse All Tools</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
