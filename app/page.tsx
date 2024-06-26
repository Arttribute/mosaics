import Link from "next/link";
import { Button } from "@/components/ui/button";

import AppBar from "@/components/layout/AppBar";
import ModesDisplay from "@/components/game/modes-display";
import { LayoutGrid } from "lucide-react";

export default function Home() {
  return (
    <div>
      <AppBar />{" "}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#9080800a_1px,transparent_2px),linear-gradient(to_bottom,#8080800a_1px,transparent_2px)] bg-[size:18px_28px]"></div>
      <div className=" my-20 mx-6 shadow-pink-800 ">
        <div className="flex flex-col items-center justify-center w-full ">
          <main className="flex flex-col items-center justify-center py-20 ">
            <div className="text-center ">
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex">
                  <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                    mosaics
                  </div>
                  <LayoutGrid className="w-7 h-7 text-indigo-500 text-xs mt-2 font-bold" />
                </div>
              </div>

              <h2 className="text-5xl font-semibold text-gray-700">
                The AI art puzzle game
              </h2>
              <p className="mt-2 text-base text-gray-500 ">
                Solve AI generated puzzles, compete on the global leaderboard
                and earn NFTs
              </p>
              <div className="mt-6">
                <Link href="/games">
                  <Button className="px-12">Start Playing</Button>
                </Link>
              </div>
              <div className="mt-4 p-16">
                <ModesDisplay />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
