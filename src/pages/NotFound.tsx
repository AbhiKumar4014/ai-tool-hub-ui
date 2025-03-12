
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-8xl font-display font-bold gradient-text mb-6">404</h1>
      <p className="text-2xl font-medium mb-4">Page Not Found</p>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved to another URL.
      </p>
      <Button size="lg" asChild>
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
