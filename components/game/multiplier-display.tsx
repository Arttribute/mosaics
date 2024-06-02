import * as React from "react";

export default function MultiplierDisplay({
  multiplier,
}: {
  multiplier: number;
}) {
  return (
    <div className="flex flex-col items-center mt-4 p-2 w-full">
      <div className="text-xl italic font-bold  bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
        <p className="mx-1">{multiplier} X</p>
      </div>
      <div className="text-sm italic font-bold  bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
        <p className="mx-1"> multiplier </p>
      </div>
    </div>
  );
}
