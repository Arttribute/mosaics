"use client";
import * as React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function FailedDialog({
  open,
  solution,
  timeRemaining,
  movesRemaining,
  onLeaveGame,
}: {
  open: boolean;
  solution: string;
  timeRemaining: number;
  movesRemaining: number;
  onLeaveGame: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="w-96">
        <div className="w-full">
          <div className="p-2 flex flex-col items-center justify-center">
            <Image
              src={solution}
              width={400}
              height={400}
              alt={"game"}
              className="aspect-square rounded-md m-1"
            />
            {timeRemaining === 0 && (
              <p className="text-base font-semibold  m-2 text-red-500">
                Time is up!
              </p>
            )}
            {movesRemaining === 0 && (
              <p className="text-lg font-semibold m-2 text-red-500">
                No moves left!
              </p>
            )}

            <p className="text-base font-semibold mb-2">
              Failed to solve puzzle 😞{" "}
            </p>
            <Button
              variant="outline"
              className="rounded-lg mt-1"
              onClick={onLeaveGame}
            >
              Exit Game
              <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
