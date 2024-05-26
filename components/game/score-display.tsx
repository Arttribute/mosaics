import * as React from "react";

export default function MovesDisplay({ score }: { score: number }) {
  return (
    <div className=" mt-4 p-0.5 border rounded-lg w-full">
      <div className="flex flex-col items-center p-3 border rounded-lg">
        <p className="text-lg font-semibold">{score}</p>
        <p className="text-md font-medium ">score</p>
      </div>
    </div>
  );
}
