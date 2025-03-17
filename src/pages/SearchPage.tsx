import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AIChatBox from "@/components/AIChatBox";
import { ArrowLeft } from "lucide-react";

const SearchPage = () => {
  return (
    <div className="container py-8 px-4 md:px-6">
      <Button variant="ghost" className="mb-6 pl-0" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="mb-8">
        <AIChatBox />
      </div>
    </div>
  );
};

export default SearchPage;
