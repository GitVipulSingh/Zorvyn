import { Link } from "react-router-dom";
import { Home, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-5">
        <MapPinOff className="h-7 w-7 text-gray-400" strokeWidth={2} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="gap-2">
        <Link to="/">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
