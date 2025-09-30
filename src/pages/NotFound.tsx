import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/dashboard" className="text-primary underline">
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
