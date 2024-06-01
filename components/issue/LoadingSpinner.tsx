import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"
      role="status"
    ></div>
  );
};

export default LoadingSpinner;
