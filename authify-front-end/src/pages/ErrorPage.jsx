import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-200 justify-center h-screen text-center px-4">
      <h1 className="text-9xl font-extrabold text-red-500">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold mt-4">Oops! Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <br /> <br />
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
