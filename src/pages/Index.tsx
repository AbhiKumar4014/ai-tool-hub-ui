import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/aiToolsService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ToolCard from '@/components/ToolCard';
import { Link, useNavigate } from 'react-router-dom';
import { AITool } from '@/services/aiToolsService';
import { RefreshCw } from 'lucide-react';
import { featuredToolsPrompt, trendingToolsPrompt } from '@/config/prompts';

const Index = () => {
  const [featuredTools, setFeaturedTools] = useState<AITool[]>([]);
  const [trendingTools, setTrendingTools] = useState<AITool[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const navigate = useNavigate();

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const fetchToolsFromAI = async (type: 'featured' | 'trending') => {
    setIsLoading(true);
    try {
      let prompt = '';
      if (type === 'featured') {
        prompt = featuredToolsPrompt;
      } else {
        prompt = trendingToolsPrompt;
      }

      const aiResponse = await window.puter.ai.chat(prompt);
      const responseText = typeof aiResponse === "object" && aiResponse.message
        ? aiResponse.message.content
        : String(aiResponse);
      const toolsData = eval(responseText);
      if (type === 'featured') {
        setFeaturedTools(toolsData);
        localStorage.setItem("featuredTools", JSON.stringify(toolsData));
        localStorage.setItem("featuredToolsTimestamp", Date.now().toString());
        setIsFeaturedLoading(false);
      } else {
        setTrendingTools(toolsData);
        localStorage.setItem("trendingTools", JSON.stringify(toolsData));
        localStorage.setItem("trendingToolsTimestamp", Date.now().toString());
        setIsTrendingLoading(false);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} tools from AI:`, error);
      setIsLoading(false);
      if (type === 'featured') {
        setIsFeaturedLoading(false);
      } else {
        setIsTrendingLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadTools = (type: 'featured' | 'trending') => {
      const storedTools = localStorage.getItem(`${type}Tools`);
      const storedTimestamp = localStorage.getItem(`${type}ToolsTimestamp`);
      const fiveHours = 5 * 60 * 60 * 1000;

      if (storedTools && storedTimestamp && Date.now() - parseInt(storedTimestamp) < fiveHours) {
        const parsedTools = JSON.parse(storedTools);
        if (type === 'featured') {
          setFeaturedTools(parsedTools);
          setIsFeaturedLoading(false);
        } else {
          setTrendingTools(parsedTools);
          setIsTrendingLoading(false);
        }
      } else {
        fetchToolsFromAI(type);
      }
    };

    loadTools('featured');
    loadTools('trending');
  }, []);

  const handleToolClick = (tool: AITool, relatedTools: AITool[] = []) => {
    navigate(`/tool/${tool.id}`, { state: { tool, relatedTools } });
  };

  const handleReload = (type: 'featured' | 'trending') => {
    fetchToolsFromAI(type);
  };

  const setIsLoading = (value: boolean) => {
    setIsFeaturedLoading(value);
    setIsTrendingLoading(value);
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
          Discover the Best AI Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our curated collection of AI tools that are revolutionizing how we work, create, and solve problems.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="font-medium">
            <Link to="/trending">Trending Tools</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-medium">
            <Link to="/new">Newly Added</Link>
          </Button>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools && featuredTools.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold">Featured Tools</h2>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/">View All</Link>
              </Button>
              <Button variant="outline" onClick={() => handleReload('featured')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFeaturedLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : (
              featuredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} featured onClick={(t) => handleToolClick(t, featuredTools)}/>
              ))
            )}
          </div>
        </section>
      )}

      {/* Trending Tools */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold">Trending Tools</h2>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/trending">View All</Link>
            </Button>
            <Button variant="outline" onClick={() => handleReload('trending')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isTrendingLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[200px] w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : (
            trendingTools?.map(tool => (
              <ToolCard key={tool.id} tool={tool} onClick={(t) => handleToolClick(t, trendingTools)}/>
            ))
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold mb-6">Explore by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isCategoriesLoading ? (
            Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : (
            categories?.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="group relative overflow-hidden rounded-lg card-hover border bg-card"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-${category.icon}`}>
                        {category.icon === "code" && (
                          <>
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                          </>
                        )}
                        {category.icon === "image" && (
                          <>
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                            <circle cx="9" cy="9" r="2"></circle>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                          </>
                        )}
                        {category.icon === "file-text" && (
                          <>
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" x2="8" y1="13" y2="13"></line>
                            <line x1="16" x2="8" y1="17" y2="17"></line>
                            <line x1="10" x2="8" y1="9" y2="9"></line>
                          </>
                        )}
                        {category.icon === "bar-chart" && (
                          <>
                            <line x1="12" x2="12" y1="20" y2="10"></line>
                            <line x1="18" x2="18" y1="20" y2="4"></line>
                            <line x1="6" x2="6" y1="20" y2="16"></line>
                          </>
                        )}
                        {category.icon === "music" && (
                          <>
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                          </>
                        )}
                        {category.icon === "message-square" && (
                          <>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </>
                        )}
                        {category.icon === "video" && (
                          <>
                            <path d="m22 8-6 4 6 4V8Z"></path>
                            <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
                          </>
                        )}
                        {category.icon === "database" && (
                          <>
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                          </>
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} tools</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Why Use This Site Section */}
      <section className="rounded-lg bg-card p-6 border">
        <h2 className="text-2xl font-display font-bold mb-4">Why Use AIToolsHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Always Updated</h3>
            <p className="text-muted-foreground">Our AI-powered system continuously monitors for new tools and automatically adds them to our directory.</p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Easily Filterable</h3>
            <p className="text-muted-foreground">Find the perfect tool for your needs with our comprehensive filtering options by category, pricing, and more.</p>
          </div>
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Trending Insights</h3>
            <p className="text-muted-foreground">Discover which AI tools are gaining traction and making waves in the industry.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
