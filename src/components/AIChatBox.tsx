import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { AITool } from "@/services/aiToolsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const parseToolsFromResponse = (text: string): AITool[] => {
    try {
      console.log(text);
      if (text.includes("```json")) {
        // Extract the JSON part
        const jsonPart = text.split("```json")[1].split("```")[0].trim();
        try {
          const parsedData = JSON.parse(jsonPart);
          console.log(parsedData)
          if (Array.isArray(parsedData)) {
            return parsedData as AITool[];
          } else {
            return [parsedData];
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
        // if (Array.isArray(parsedData)) {
        //   return parsedData as AITool[];
        // }
      }
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
              url: currentTool.url || "#",
              logoUrl: "/placeholder.svg", // Use placeholder for AI-generated entries
              category: currentTool.category || "general",
              pricing: currentTool.pricing || "Unknown",
              dateAdded: new Date().toISOString(),
              updated: new Date().toISOString(),
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
            currentTool.url = line.split(':').slice(1).join(':').trim();
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
          url: currentTool.url || "#",
          logoUrl: "/placeholder.svg", // Use placeholder for AI-generated entries
          category: currentTool.category || "general",
          pricing: currentTool.pricing || "Unknown",
          dateAdded: new Date().toISOString(),
          updated: new Date().toISOString(),
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
  
  const enhancePromptForSpecificTool = (userPrompt: string): string => {
    // Check if the prompt seems to be asking about a specific tool
    const specificToolRegex = /(?:about|what is|details on|info on|tell me about)\s+([a-zA-Z0-9\s]+)(?:\?|\.|\s|$)/i;
    const match = userPrompt.match(specificToolRegex);
    
    if (match && match[1]) {
      const toolName = match[1].trim();
      return `Please provide comprehensive details about the AI tool called "${toolName}". 
Include the following information in a structured json format keys in snakecase and add a id:
1. Name: Full name of the tool
2. Description: A detailed description of what the tool does
3. Website URL: The official website link
4. Category: What type of AI tool is it (e.g. text generation, image generation, coding)
5. Pricing: Free, freemium, paid, or subscription details
6. Company: Which company developed this tool
7. Key features: What makes this tool stand out
8. Use cases: Common applications of this tool
9. Trending: boolean variable
10. Featured: boolean variable

Format your answer in a clean, structured way with clear headings for each section.`;
    } else if (userPrompt.toLowerCase().includes("trending") || 
               userPrompt.toLowerCase().includes("popular") ||
               userPrompt.toLowerCase().includes("top") ||
               userPrompt.toLowerCase().includes("list") ||
               userPrompt.toLowerCase().includes("best")) {
      return `List the top trending AI tools right now. For each tool, include:
Include the following information in a structured json array format keys in snakecase and add a id that should be unique and:
1. Name: Full name of the tool
2. Description: A detailed description of what the tool does
3. Website URL: The official website link
4. Category: What type of AI tool is it (e.g. text generation, image generation, coding)
5. Pricing: Free, freemium, paid, or subscription details that should be array
6. Company: Which company developed this tool
7. Key features: What makes this tool stand out
8. Use cases: Common applications of this tool
9. Trending: boolean variable
10. Featured: boolean variable

Format your answer in a clean, structured way with clear headings for each section.`;
    } else {
      return `I'm looking for AI tools about: ${userPrompt}. Please provide details about the best tools in this category including:
1. Name: Full name of each tool
2. Description: What the tool does and its main benefits
3. Website URL: The official website for each tool
4. Category: More specific type within the requested category
5. Pricing: Free, freemium, paid, or subscription details
6. Company: Which company created each tool

Format your answer as a numbered list with clear sections for each tool.`;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse(""); // Clear previous response
    setParsedTools([]);
    
    try {
      // Enhance the prompt based on what the user is asking
      const enhancedPrompt = enhancePromptForSpecificTool(prompt);
      
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
                {Array.isArray(parsedTools) && parsedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onClick={(t) => handleToolClick(t)} />
                ))}
                {Array.isArray(parsedTools) && parsedTools.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No tools found. Try asking about a specific tool or category.
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
        Powered by Puter AI • Responses are generated and may not always be accurate
      </CardFooter>
    </Card>
  );
};

export default AIChatBox;
