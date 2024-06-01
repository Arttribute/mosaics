"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";
import { Loader2 } from "lucide-react";

import { Play as PlayIcon } from "lucide-react";
import { SquareArrowOutUpRight } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function LoadingPuzzleDisplay({
  gameScore,
}: {
  gameScore: number;
}) {
  return (
    <>
      <div className=" border py-12 px-8 m-2  rounded-xl w-96 h-96">
        <div className=" flex flex-col items-center justify-center ">
          <div className="text-center mb-10"></div>

          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium text-gray-500 ml-2">
              Working fast to generate puzzle images
            </p>
          </div>
          <div className="mt-4">
            <Link href="/games">
              <Button
                variant="ghost"
                className="rounded-lg mt-1 text-xs font-light text-gray-500 w-52"
              >
                Exit Game
                <ChevronRight size={20} className=" w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
