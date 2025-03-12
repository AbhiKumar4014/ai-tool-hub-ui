
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send } from "lucide-react";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse(""); // Clear previous response
    
    try {
      // Try to structure the prompt to get better results for AI tools
      const enhancedPrompt = `I'm looking for AI tools about: ${prompt}. Please provide details about the best tools in this category including their names, descriptions, websites, categories, and pricing if available. Format your answer as a clear list.`;
      
      const aiResponse = await window.puter.ai.chat(enhancedPrompt);
      
      // Handle the response properly - extract the text content
      const responseText = typeof aiResponse === 'object' && aiResponse.message ? 
        aiResponse.message.content : 
        String(aiResponse);
        
      setResponse(responseText);
      
      // Here you could parse the AI response and extract structured tool data
      // if (onToolsReceived) {
      //   const parsedTools = parseAIResponseIntoTools(aiResponse);
      //   onToolsReceived(parsedTools);
      // }
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
              placeholder="e.g., 'image generation tools' or 'best AI for coding'"
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
        
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="whitespace-pre-line">
              {response ? (
                <div className="prose dark:prose-invert">
                  {response}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Ask me about any AI tools or technologies you're interested in!
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by Puter AI • Responses are generated and may not always be accurate
      </CardFooter>
    </Card>
  );
};

export default AIChatBox;
