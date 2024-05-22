import Image from "next/image";
import TileSelector from "@/components/game/tile-selector";

export default function Game() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-6 h-screen">
        <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
          <h1 className="text-lg font-bold">Brown fox jumps over lazy dog</h1>
        </div>
        <TileSelector src="/puzzle1.jpeg" numCols={3} numRows={3} />
      </div>
    </div>
  );
}
