"use client";
import * as React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SuccessDialog({
  open,
  solution,
  onContinue,
}: {
  open: boolean;
  solution: string;
  onContinue: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="w-full">
          <div className="p-2 flex flex-col items-center justify-center">
            <Image
              src={solution}
              width={500}
              height={500}
              alt={"game"}
              className="aspect-square rounded-md m-1"
            />
            <p className="text-xl font-semibold  m-2">Puzzle solved 🎉</p>
            <Button
              variant="outline"
              className="rounded-lg mt-1"
              onClick={onContinue}
            >
              Go to next promptle
              <ChevronRight size={20} className="ml-0.5 w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
