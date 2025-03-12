import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { AITool } from "@/services/aiToolsService";

const TrendingPage = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTrendingToolsFromAI = async () => {
    setIsLoading(true);
    try {
      const prompt = `Research and list the top 20 trending AI tools currently available. Please ensure your response spans a diverse range of categories such as coding assistants, design tools, automation, productivity, and data analytics. For each tool, gather and include comprehensive details including:
- Primary use case and target audience.
- Key features and standout functionalities.
- Additional information such as pricing, company, origin, and tags when available.
- The current trend status, and whether the tool is featured.

Return your answer strictly as a JSON array or JSON where each element is an object conforming to the following TypeScript interface:

export interface AITool {
  id: string;                     // Unique identifier for the tool.
  name: string;                   // Name of the tool.
  description: string;            // A concise bio summarizing its primary use case, key features, target audience, and unique selling points.
  category: string;               // Main category (e.g., Coding, Design, Automation, Productivity, Data Analytics etc...).
  subcategory?: string;           // (Optional) More specific category if applicable.
  url: string;                    // Official website or landing page URL.
  logoUrl: string;                // URL to the tool's logo image.
  pricing?: array;                // Pricing details provided as a JSON Array and it contains type should be free or premium, plan and cost are the keys.
  company?: string;               // (Optional) Name of the company behind the tool.
  origin?: string;                // (Optional) Country or region of origin.
  trending?: boolean;             // (Optional) Indicates if the tool is currently trending.
  featured?: boolean;             // (Optional) Indicates if the tool is featured.
  tags?: string[];                // (Optional) A list of tags relevant to the tool.
  features: string[];             // A List of key features about the tool
  created: string;
  updated: string;
}

Ensure that:
1. Each tool's object includes all the fields listed above. If certain details are not available, provide an appropriate null or empty value.
2. The "description" field succinctly summarizes the tool's capabilities, primary use case, and its target market.
3. The final output is strictly well-formatted, valid JSON with no extra commentary or markdown formatting.`;

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
          : tools?.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={(t) => handleToolClick(t, tools)} />
            ))}
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
