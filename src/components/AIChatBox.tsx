
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { AITool } from "@/services/aiToolsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [parsedTools, setParsedTools] = useState<AITool[]>([]);
  const [activeTab, setActiveTab] = useState("text");
  
  const parseToolsFromResponse = (text: string): AITool[] => {
    try {
      // Basic parsing logic - look for numbered or bulleted lists
      const lines = text.split('\n');
      const tools: AITool[] = [];
      
      let currentTool: Partial<AITool> | null = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this looks like a new tool entry (numbered or with a prominent name)
        if (line.match(/^\d+[\.\)]\s/) || line.match(/^•\s/) || (line.length > 0 && line === line.toUpperCase()) || line.match(/^[A-Z][a-zA-Z0-9\s]+:$/)) {
          // Save the previous tool if exists
          if (currentTool && currentTool.name) {
            tools.push({
              id: `ai-tool-${tools.length + 1}`,
              name: currentTool.name,
              description: currentTool.description || "No description available",
              websiteUrl: currentTool.websiteUrl || "#",
              logoUrl: "/placeholder.svg", // Use placeholder for AI-generated entries
              category: currentTool.category || "general",
              pricing: currentTool.pricing || "Unknown",
              dateAdded: new Date().toISOString(),
              company: currentTool.company || "AI Recommended",
              trending: true
            } as AITool);
          }
          
          // Start a new tool
          currentTool = {};
          
          // Extract name from the line
          const nameMatch = line.match(/^\d+[\.\)]\s+(.+?)($|:)/) || 
                           line.match(/^•\s+(.+?)($|:)/) ||
                           line.match(/^([A-Z][a-zA-Z0-9\s]+)($|:)/);
          
          if (nameMatch) {
            currentTool.name = nameMatch[1].trim();
          } else {
            currentTool.name = line.replace(/[:]/g, '').trim();
          }
          
          continue;
        }
        
        // If we have a current tool, try to extract details
        if (currentTool) {
          const lowerLine = line.toLowerCase();
          
          if (lowerLine.includes('description:') || lowerLine.startsWith('description')) {
            currentTool.description = line.split(':').slice(1).join(':').trim();
          } else if (lowerLine.includes('website:') || lowerLine.includes('url:') || lowerLine.includes('link:')) {
            currentTool.websiteUrl = line.split(':').slice(1).join(':').trim();
          } else if (lowerLine.includes('category:') || lowerLine.includes('type:')) {
            currentTool.category = line.split(':').slice(1).join(':').trim().toLowerCase();
          } else if (lowerLine.includes('pricing:') || lowerLine.includes('price:') || lowerLine.includes('cost:')) {
            currentTool.pricing = line.split(':').slice(1).join(':').trim();
          } else if (lowerLine.includes('company:') || lowerLine.includes('developed by:') || lowerLine.includes('creator:')) {
            currentTool.company = line.split(':').slice(1).join(':').trim();
          } else if (currentTool.description) {
            // Append to description if it doesn't match other properties
            currentTool.description += ' ' + line;
          } else {
            // If no description yet, start one
            currentTool.description = line;
          }
        }
      }
      
      // Add the last tool if exists
      if (currentTool && currentTool.name) {
        tools.push({
          id: `ai-tool-${tools.length + 1}`,
          name: currentTool.name,
          description: currentTool.description || "No description available",
          websiteUrl: currentTool.websiteUrl || "#",
          logoUrl: "/placeholder.svg", // Use placeholder for AI-generated entries
          category: currentTool.category || "general",
          pricing: currentTool.pricing || "Unknown",
          dateAdded: new Date().toISOString(),
          company: currentTool.company || "AI Recommended",
          trending: true
        } as AITool);
      }
      
      return tools;
    } catch (error) {
      console.error("Error parsing tools from AI response:", error);
      return [];
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse(""); // Clear previous response
    setParsedTools([]);
    
    try {
      // Try to structure the prompt to get better results for AI tools
      const enhancedPrompt = prompt.toLowerCase().includes("trending") || prompt.toLowerCase().includes("popular") ? 
        `List the top trending AI tools right now. For each tool, include: name, description, website URL (if available), category, pricing (if available), and the company that created it. Format as a numbered list.` :
        `I'm looking for AI tools about: ${prompt}. Please provide details about the best tools in this category including their names, descriptions, websites, categories, and pricing if available. Format your answer as a numbered list.`;
      
      const aiResponse = await window.puter.ai.chat(enhancedPrompt);
      
      // Handle the response properly - extract the text content
      const responseText = typeof aiResponse === 'object' && aiResponse.message ? 
        aiResponse.message.content : 
        String(aiResponse);
      
      setResponse(responseText);
      
      // Parse the response into tool cards
      const tools = parseToolsFromResponse(responseText);
      setParsedTools(tools);
      
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
      setResponse("Sorry, I couldn't get information about AI tools at the moment. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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
              <TabsTrigger value="cards" disabled={parsedTools.length === 0}>Tool Cards</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <div className="whitespace-pre-line">
                <div className="prose dark:prose-invert">
                  {response}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="cards">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {parsedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
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
        Powered by Puter AI • Responses are generated and may not always be accurate
      </CardFooter>
    </Card>
  );
};

export default AIChatBox;
