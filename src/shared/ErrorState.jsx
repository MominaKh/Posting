import React from "react";

const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center">
      <div className="text-center">
        <span className="material-icons text-6xl text-red-500 block mb-4">
          error_outline
        </span>
        <h3 className="font-fenix text-2xl text-white mb-2">
          {message}
        </h3>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-columbia-blue text-rich-black rounded hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;