"use client";
import Image from "next/image";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";

export default function Game() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-6 h-screen">
        <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
          <h1 className="text-lg font-bold">Brown fox jumps over lazy dog</h1>
        </div>

        <PuzzleTimer
          initialSeconds={60}
          secondsLeft={60}
          setSecondsLeft={() => {}}
          isActive={false}
          setIsActive={() => {}}
        />
        <TileSelector
          src="https://res.cloudinary.com/arttribute/image/upload/v1715629309/vfgzrvx9zjnhuuabg4ix.jpg"
          numCols={3}
          numRows={3}
        />
      </div>
    </div>
  );
}
