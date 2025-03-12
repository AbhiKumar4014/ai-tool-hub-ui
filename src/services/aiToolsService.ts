
import { toast } from "sonner";

// Types for our AI tools data
export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  url: string;
  logoUrl: string;
  pricing?: string;
  company?: string;
  origin?: string;
  trending?: boolean;
  featured?: boolean;
  tags?: string[];
  dateAdded: string;
  updated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

// Mock data for now
// In a real implementation, this would come from an API
const mockCategories: Category[] = [
  {
    id: "coding",
    name: "Code Generation",
    icon: "code",
    description: "Tools that help with writing, debugging, and optimizing code",
    count: 12
  },
  {
    id: "image",
    name: "Image Generation",
    icon: "image",
    description: "Create and edit images using AI",
    count: 15
  },
  {
    id: "text",
    name: "Text & Content",
    icon: "file-text",
    description: "Generate and enhance text content",
    count: 20
  },
  {
    id: "data",
    name: "Data Analysis",
    icon: "bar-chart",
    description: "Tools for analyzing and visualizing data",
    count: 8
  },
  {
    id: "audio",
    name: "Audio & Voice",
    icon: "music",
    description: "Speech recognition, music generation, and audio editing",
    count: 10
  },
  {
    id: "chat",
    name: "Chatbots",
    icon: "message-square",
    description: "Conversational AI assistants",
    count: 14
  },
  {
    id: "video",
    name: "Video Generation",
    icon: "video",
    description: "Create and edit videos with AI",
    count: 7
  },
  {
    id: "sql",
    name: "SQL Generation",
    icon: "database",
    description: "Generate SQL queries using natural language",
    count: 6
  }
];

// Sample company origins
const origins = [
  "OpenAI", "Google", "Microsoft", "Anthropic", "Meta", "Stability AI", 
  "Midjourney", "Hugging Face", "Cohere", "Replicate", "Runway", "Jasper", 
  "Vercel", "Independent", "Startup"
];

// Generate mock tools data (30 tools)
const generateMockTools = (): AITool[] => {
  const toolNames = [
    "CodeMaster AI", "ImageCraft", "TextGenius", "DataSage", "VoicePro", 
    "ChatWhiz", "VideoForge", "SQLScribe", "PromptMaster", "AICanvas",
    "CodeWizard", "PixelGenius", "ContentCraft", "InsightAnalytics", "SoundStudio",
    "ConverseMaster", "MotionAI", "QueryCraft", "DevAssistant", "ArtificialDesigner",
    "CodeCompanion", "PixelPerfect", "WriterBot", "DataLens", "EchoStudio",
    "TalkMate", "VideoWizard", "DBHelper", "LogicLab", "CreativeEngine"
  ];
  
  return toolNames.map((name, index) => {
    const id = `tool-${index + 1}`;
    let category: string;
    
    if (index < 4) category = "coding";
    else if (index < 8) category = "image";
    else if (index < 12) category = "text";
    else if (index < 16) category = "data";
    else if (index < 20) category = "audio";
    else if (index < 24) category = "chat";
    else if (index < 28) category = "video";
    else category = "sql";
    
    const dateAdded = new Date();
    dateAdded.setDate(dateAdded.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id,
      name,
      description: `${name} is a powerful AI tool that helps you accomplish tasks faster and with better results.`,
      category,
      url: "https://example.com",
      logoUrl: `https://source.unsplash.com/random/200x200?ai&sig=${index}`,
      pricing: ["Free", "Freemium", "Paid", "Enterprise"][Math.floor(Math.random() * 4)],
      company: `${name.split(" ")[0]} Inc.`,
      origin: origins[Math.floor(Math.random() * origins.length)],
      trending: Math.random() > 0.7,
      featured: Math.random() > 0.8,
      tags: ["ai", category, Math.random() > 0.5 ? "trending" : "new"],
      dateAdded: dateAdded.toISOString(),
      updated: new Date().toISOString()
    };
  });
};

const mockTools = generateMockTools();

// Function to simulate fetching all tools
export const fetchAllTools = async (): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, fetch from an API endpoint
  return mockTools;
};

// Function to simulate fetching trending tools
export const fetchTrendingTools = async (): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Filter for trending tools
  return mockTools.filter(tool => tool.trending);
};

// Function to simulate fetching featured tools
export const fetchFeaturedTools = async (): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter for featured tools
  return mockTools.filter(tool => tool.featured);
};

// Function to simulate fetching tools by category
export const fetchToolsByCategory = async (categoryId: string): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter by category
  return mockTools.filter(tool => tool.category === categoryId);
};

// Function to simulate fetching tools by origin
export const fetchToolsByOrigin = async (origin: string): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter by origin
  return mockTools.filter(tool => tool.origin === origin);
};

// Function to simulate fetching all categories
export const fetchCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real implementation, fetch from an API endpoint
  return mockCategories;
};

// Function to simulate fetching newly added tools (last 7 days)
export const fetchNewTools = async (): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Filter tools added in the last 7 days
  return mockTools.filter(tool => {
    const addDate = new Date(tool.dateAdded);
    return addDate > sevenDaysAgo;
  });
};

// Function to simulate searching for tools
export const searchTools = async (query: string): Promise<AITool[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // Search in name, description, tags
  return mockTools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  });
};

// Function to simulate fetching a single tool by ID
export const fetchToolById = async (id: string): Promise<AITool | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find the tool by ID
  const tool = mockTools.find(tool => tool.id === id);
  
  return tool || null;
};

// Function to simulate reporting an incorrect or outdated tool
export const reportTool = async (toolId: string, issue: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, send to an API endpoint
  console.log(`Reported issue with tool ${toolId}: ${issue}`);
  
  toast.success("Thank you for your feedback!", {
    description: "We'll review the reported issue soon."
  });
  
  return true;
};

// Function to get all unique origins (companies)
export const fetchOrigins = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Get unique origins
  const uniqueOrigins = Array.from(new Set(mockTools.map(tool => tool.origin)));
  
  return uniqueOrigins.filter(origin => !!origin) as string[];
};
