import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AINewsPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchAINews = async (page: number) => {
    setIsLoading(true);
    try {
      const prompt = `Research and list the valid significant news articles and blog posts about artificial intelligence from authoritative and reputable sources. Ensure that the articles cover a diverse range of AI-related topics, including advancements in AI technology, ethical concerns, industry impact, regulatory changes, and major corporate developments.
            For each article, provide the following structured information in a strictly well-formatted and valid JSON array, with no extra commentary or markdown formatting:
            title: The headline of the article.
            summary: A concise summary capturing the key points of the article.
            source: The name of the reputable source or publisher.
            url: The direct link to the article.
            The JSON response should be properly formatted and free of any additional commentary.`;
      const aiResponse = await window.puter.ai.chat(prompt);
      const responseText =
        typeof aiResponse === "object" && aiResponse.message
          ? aiResponse.message.content
          : String(aiResponse);

      // Assuming the AI returns a JSON array of news items
      console.log(responseText);
      const newsData = eval(responseText);
      setNews(newsData);
      console.log(newsData);
    } catch (error) {
      console.error("Failed to fetch AI news:", error);
      setNews([{ title: "Failed to load AI news. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAINews(currentPage);
  }, [currentPage]);

  const totalPages = 5;

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
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
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold gradient-text mb-2">
          AI News and Blogs
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Stay up-to-date with the latest news, trends, and insights in the
          world of AI.
        </p>
      </div>

      <div>
        {isLoading
          ? // Skeleton loaders while loading
            Array(5)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-3/4" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-1/2" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))
          : // Display news items
            news.map((item, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>{item?.title}</CardTitle>
                  <CardDescription>{item?.source}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{item?.summary}</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link
                      to={item?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AINewsPage;
