import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { AITool } from "@/services/aiToolsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface AIChatBoxProps {
  onToolsReceived?: (toolsData: any) => void;
}

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string) => Promise<any>;
      };
    };
  }
}

const AIChatBox = ({ onToolsReceived }: AIChatBoxProps) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTools, setParsedTools] = useState([]);
  const [activeTab, setActiveTab] = useState("text");
  const navigate = useNavigate();

  useEffect(() => {
    const savedPrompt = sessionStorage.getItem("aiChatPrompt");
    const savedResponse = sessionStorage.getItem("aiChatResponse");
    const savedParsedTools = sessionStorage.getItem("aiChatParsedTools");
    const savedActiveTab = sessionStorage.getItem("aiChatActiveTab");

    if (savedPrompt) setPrompt(savedPrompt);
    if (savedResponse) setResponse(savedResponse);
    if (savedParsedTools) setParsedTools(JSON.parse(savedParsedTools));
    if (savedActiveTab) setActiveTab(savedActiveTab);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("aiChatPrompt", prompt);
    sessionStorage.setItem("aiChatResponse", response);
    sessionStorage.setItem("aiChatParsedTools", JSON.stringify(parsedTools));
    sessionStorage.setItem("aiChatActiveTab", activeTab);
  }, [prompt, response, parsedTools, activeTab]);

  const enhancePromptForSpecificTool = (userPrompt: string): string => {
    const basePrompt = `Return your answer strictly as a JSON array or JSON where each element is an object conforming to the following TypeScript interface:
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

    if (
      userPrompt.toLowerCase().includes("trending") ||
      userPrompt.toLowerCase().includes("best") ||
      userPrompt.toLowerCase().includes("top")
    ) {
      return `Research and list the top trending AI tools currently available that should be ${userPrompt}. Please ensure your response spans a diverse range of categories such as coding assistants, design tools, automation, productivity, and data analytics. For each tool, gather and include comprehensive details including:
- Primary use case and target audience.
- Key features and standout functionalities.
- Additional information such as pricing, company, origin, and tags when available.
- The current trend status, and whether the tool is featured.

${basePrompt}`;
    }

    const specificToolRegex = /(?:about|what is|details on|info on|tell me about)\s+([a-zA-Z0-9\s]+)(?:\?|\.|\s|$)/i;
    const match = userPrompt.match(specificToolRegex);

    if (match && match[1]) {
      const toolName = match[1].trim();
      return `Please provide comprehensive details about the AI tool called "${toolName}". 
${basePrompt}`;
    } else if (userPrompt.toLowerCase().includes("list")) {
      return `List the AI tools ${userPrompt}. For each tool, include:
${basePrompt}`;
    } else {
      return `I'm looking for AI tools about: ${userPrompt}. Please provide details about the best tools in this category including:
${basePrompt}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse(""); // Clear previous response
    // setParsedTools([]);

    try {
      // Enhance the prompt based on what the user is asking
      const enhancedPrompt = enhancePromptForSpecificTool(prompt);
      console.log(enhancedPrompt);
      const aiResponse = await window.puter.ai.chat(enhancedPrompt);

      // Handle the response properly - extract the text content
      const responseText =
        typeof aiResponse === "object" && aiResponse.message
          ? aiResponse.message.content
          : String(aiResponse);

      setResponse(responseText);

      // Parse the response into tool cards
      // const tools = parseToolsFromResponse(responseText);
      const tools = eval(responseText);
      console.log(typeof tools, tools);
      setParsedTools(tools);
      console.log(parsedTools.length, tools.length);

      // Provide the parsed tools to the parent component if callback exists
      if (onToolsReceived && tools.length > 0) {
        onToolsReceived(tools);
      }

      // Switch to cards view if we successfully parsed tools
      if (tools.length > 0) {
        setActiveTab("cards");
      }
    } catch (error) {
      console.error("AI request failed:", error);
      setResponse(
        "Sorry, I couldn't get information about AI tools at the moment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleToolClick = (tool: AITool, relatedTools: AITool[] = []) => {
    navigate(`/tool/${tool.id}`, { state: { tool, relatedTools } });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ask About AI Tools</CardTitle>
        <CardDescription>
          Ask about any AI tools or categories you're interested in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex w-full gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="e.g., 'show trending AI tools' or 'best AI for coding'"
              className="pl-10"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </form>

        {(response || parsedTools.length > 0) && !isLoading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Response</TabsTrigger>
              <TabsTrigger value="cards" disabled={parsedTools.length === 0}>
                Tool Cards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <div className="whitespace-pre-line">
                <div className="prose dark:prose-invert">{response}</div>
              </div>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                {Array.isArray(parsedTools) &&
                  parsedTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onClick={(t) => handleToolClick(t)}
                    />
                  ))}
                {Array.isArray(parsedTools) && parsedTools.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No tools found. Try asking about a specific tool or
                    category.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {isLoading && (
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {!response && !isLoading && parsedTools.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Ask me about any AI tools or technologies you're interested in!
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by Puter AI • Responses are generated and may not always be
        accurate
      </CardFooter>
    </Card>
  );
};

export default AIChatBox;
