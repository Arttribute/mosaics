"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Play as PlayIcon } from "lucide-react";
import { SquareArrowOutUpRight } from "lucide-react";
import { ChevronRight } from "lucide-react";

export default function StartGameDisplay({
  gameTitle,
  onStartGame,
}: {
  gameTitle: string;
  onStartGame: () => void;
}) {
  return (
    <>
      <div className="flex">
        <div className="text-lg font-bold  bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Mosaics
        </div>
        <Puzzle className="w-3.5 h-3.5 text-purple-500 text-xs mt-0.5 font-bold" />
      </div>
      <div className=" border py-12 px-8 m-2  rounded-xl w-96 h-96">
        <div className=" flex flex-col items-center justify-center ">
          <div className="text-center mb-10">
            <p className="text-2xl font-semibold ">{gameTitle}</p>
            <p className="text-lg text-gray-500 ">
              Arrange the pieces to solve the puzzle
            </p>
            <p className="text-md text-gray-500 mt-4">
              An AI game agent will be playing against you
            </p>
          </div>

          <Button
            className="rounded-lg mt-1 px-6 w-52"
            onClick={async () => {
              onStartGame();
            }}
          >
            Start Game
            <PlayIcon size={20} className="ml-0.5 w-4 h-4" />
          </Button>

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
