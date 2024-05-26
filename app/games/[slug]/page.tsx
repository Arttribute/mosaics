"use client";
import Image from "next/image";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

export default function Game({ params }: { params: { slug: string } }) {
  const client = new Ably.Realtime({ authUrl: "/api" });
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={params.slug}>
        <div>
          <div className="flex flex-col items-center justify-center mt-6 h-screen">
            <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
              <h1 className="text-lg font-bold">
                Brown fox jumps over lazy dog
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Channel name = {params.slug}
            </p>
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
              client={client}
              channelName={params.slug}
            />
          </div>
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}
