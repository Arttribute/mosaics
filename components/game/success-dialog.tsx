"use client";
import * as React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function SuccessDialog({
  open,
  solution,
  mode,
  stakeAmount,
  multiplier,
  onContinue,
  onLeaveGame,
}: {
  open: boolean;
  solution: string;
  mode: "single" | "multiplayer" | "earn";
  stakeAmount?: string;
  multiplier?: number;
  onContinue: () => void;
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
            <p className="text-xl font-semibold  m-2">Puzzle solved 🎉</p>
            {mode === "earn" && multiplier && (
              <p className="text-sm  m-2">
                You earned {Number(stakeAmount) * multiplier} FIL
              </p>
            )}
            <div className="flex flex-col items-center justify-center w-full">
              <Button
                variant="outline"
                className="rounded-lg  mt-1 w-full border-gray-400"
                onClick={onContinue}
              >
                Go to next puzzle
                <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
              </Button>
              <Button
                className="rounded-lg mt-1 border-gray-500 w-full"
                onClick={onLeaveGame}
              >
                {mode === "earn"
                  ? "Claim reward and NFT"
                  : "Claim NFT and End game"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
