import React, { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Search, Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Category, fetchCategories } from "@/services/aiToolsService";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";

interface LayoutProps {
  children: React.ReactNode;
}


export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const renderSidebarContent = () => (
    <>
      <div className="px-3 py-2">
        <Link to="/" className="flex items-center px-2 py-1.5">
          <span className="font-display text-xl font-bold gradient-text">AIToolsHub</span>
        </Link>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Link to="/search">
            <input
              type="text"
              placeholder="Search AI tools..."
              className="w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) {
                  setIsSearchOpen(false);
                }
                window.location.href = "/search";
              }}
            />
          </Link>
        </div>
      </div>
      <div className="px-3 mt-4 flex-1 overflow-auto">
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-muted-foreground px-2 py-1.5">
            Discover
          </div>
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === "/" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <Menu size={16} />
            <span>All Tools</span>
          </Link>
          <Link 
            to="/trending" 
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === "/trending" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <span>Trending</span>
          </Link>
          <Link 
            to="/new" 
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === "/new" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            </svg>
            <span>Newly Added</span>
          </Link>
          <Link 
            to="/news" 
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === "/news" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper">
              <path d="M4 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3z"></path>
              <path d="M9 3v6h6V3"></path>
              <line x1="3" x2="21" y1="15" y2="15"></line>
              <line x1="3" x2="21" y1="19" y2="19"></line>
            </svg>
            <span>AI News</span>
          </Link>
        </div>
        {categories.length > 0 && (
          <div className="mt-6 space-y-1">
            <div className="text-xs font-medium uppercase text-muted-foreground px-2 py-1.5">
              Categories
            </div>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === `/category/${category.id}` && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon name={category.name} />
                  <span>{category.name}</span>
                </div>
                {/* <span className="text-xs text-muted-foreground rounded-full bg-secondary px-2 py-0.5">
                  {category.count}
                </span> */}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-border px-3 py-3">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-accent text-accent-foreground" : ""}
          >
            <Sun size={18} />
            <span className="sr-only">Light Mode</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
          >
            <Moon size={18} />
            <span className="sr-only">Dark Mode</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme("system")}
            className={theme === "system" ? "bg-accent text-accent-foreground" : ""}
          >
            <Laptop size={18} />
            <span className="sr-only">System Theme</span>
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <nav className="flex flex-col h-full">
                {renderSidebarContent()}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <Link to="/" className="flex items-center">
              <span className="font-display text-xl font-bold gradient-text">AIToolsHub</span>
            </Link>
          </div>
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-72">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4">
                  <h2 className="text-lg font-semibold mb-4">Search AI Tools</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Link to="/search">
                      <input
                        type="text"
                        placeholder="Search AI tools, categories, companies..."
                        className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSearchOpen(false);
                          window.location.href = "/search";
                        }}
                      />
                    </Link>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Popular Searches</div>
                    <div className="flex flex-wrap gap-2">
                      <Link to="/search?q=code" className="text-sm bg-secondary rounded-full px-3 py-1" onClick={() => setIsSearchOpen(false)}>
                        Code Generation
                      </Link>
                      <Link to="/search?q=image" className="text-sm bg-secondary rounded-full px-3 py-1" onClick={() => setIsSearchOpen(false)}>
                        Image AI
                      </Link>
                      <Link to="/search?q=chat" className="text-sm bg-secondary rounded-full px-3 py-1" onClick={() => setIsSearchOpen(false)}>
                        Chatbots
                      </Link>
                      <Link to="/category/sql" className="text-sm bg-secondary rounded-full px-3 py-1" onClick={() => setIsSearchOpen(false)}>
                        SQL Tools
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="hidden md:flex border-r bg-sidebar">
          <SidebarContent className="flex flex-col h-full">
            {renderSidebarContent()}
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <Link to="/" className="md:hidden flex items-center">
                <span className="font-display text-xl font-bold gradient-text">AIToolsHub</span>
              </Link>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
