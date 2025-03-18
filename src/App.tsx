import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import ToolDetails from "./pages/ToolDetails";
import CategoryPage from "./pages/CategoryPage"; 
import TrendingPage from "./pages/TrendingPage";
import NewToolsPage from "./pages/NewToolsPage";
import SearchPage from "./pages/SearchPage";
import OriginPage from "./pages/OriginPage";
import NotFound from "./pages/NotFound";
import AIChatBox from './components/AIChatBox';
import AINewsPage from "./pages/AINewsPage";
import {Chatbot} from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tool/:id" element={<ToolDetails />} />
              <Route path="/category/:id" element={<CategoryPage />} /> 
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/new" element={<NewToolsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/origin/:id" element={<OriginPage />} />
              <Route path="/news" element={<AINewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          <Chatbot />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
