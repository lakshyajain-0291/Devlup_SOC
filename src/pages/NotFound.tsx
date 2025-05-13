
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-terminal">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-terminal-error">404</h1>
        <p className="text-xl text-terminal-dim mb-4">Oops! Page not found</p>
        <Link to="/" className="text-terminal-accent hover:text-terminal-text underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
