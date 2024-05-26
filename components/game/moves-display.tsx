import * as React from "react";

export default function MovesDisplay({ moves }: { moves: number }) {
  return (
    <div className="flex flex-col items-center mt-4 p-2 border rounded-lg w-full">
      <p className="text-3xl font-semibold">{moves}</p>
      <p className="text-md font-medium ">moves</p>
    </div>
  );
}
