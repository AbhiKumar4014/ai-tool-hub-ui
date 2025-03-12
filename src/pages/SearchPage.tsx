
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "react-router-dom";
import { searchTools, fetchCategories, fetchOrigins } from "@/services/aiToolsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, Search, X } from "lucide-react";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["searchTools", searchQuery],
    queryFn: () => searchTools(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: origins } = useQuery({
    queryKey: ["origins"],
    queryFn: fetchOrigins,
  });

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
  }, [searchQuery, location.search, location.pathname]);

  // Filter results by category and origin
  const filteredResults = searchResults?.filter(tool => {
    let matchesCategory = true;
    let matchesOrigin = true;
    
    if (selectedCategory) {
      matchesCategory = tool.category === selectedCategory;
    }
    
    if (selectedOrigin) {
      matchesOrigin = tool.origin === selectedOrigin;
    }
    
    return matchesCategory && matchesOrigin;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already updated by the input
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedOrigin(null);
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <Button variant="ghost" className="mb-6 pl-0" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          Search AI Tools
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Find the perfect AI tool for your needs by searching our extensive directory.
        </p>

        <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, description, category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mr-4">
              <span className="text-sm text-muted-foreground">Categories:</span>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {origins && origins.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Origin:</span>
              {origins.slice(0, 5).map((origin) => (
                <Badge
                  key={origin}
                  variant={selectedOrigin === origin ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedOrigin(selectedOrigin === origin ? null : origin)}
                >
                  {origin}
                </Badge>
              ))}
            </div>
          )}

          {(selectedCategory || selectedOrigin) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {searchQuery.length > 0 ? (
        <>
          {isSearching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
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
                ))}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-medium">
                  {filteredResults?.length || 0} results for "{searchQuery}"
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults?.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
              
              {filteredResults?.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any tools matching your search criteria.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Popular Searches</h3>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Button variant="outline" onClick={() => setSearchQuery("code")}>Code Generation</Button>
            <Button variant="outline" onClick={() => setSearchQuery("image")}>Image Generation</Button>
            <Button variant="outline" onClick={() => setSearchQuery("chatbot")}>Chatbots</Button>
            <Button variant="outline" onClick={() => setSearchQuery("sql")}>SQL Tools</Button>
            <Button variant="outline" onClick={() => setSearchQuery("writing")}>Writing Assistant</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
