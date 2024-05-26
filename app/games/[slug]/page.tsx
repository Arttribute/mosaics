"use client";
import Image from "next/image";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import MovesDisplay from "@/components/game/moves-display";
import ScoreDisplay from "@/components/game/score-display";
import { useEffect, useRef, useState } from "react";

const givenTime = 60;

export default function Game({ params }: { params: { slug: string } }) {
  const [movesTaken, setMovesTaken] = useState(0);
  const [remainingMoves, setRemainingMoves] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(givenTime);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [puzzleIsComplete, setPuzzleIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const client = new Ably.Realtime({ authUrl: "/api" });

  useEffect(() => {
    setRemainingMoves(10 - movesTaken);
  }, [movesTaken]);

  const handleNextPuzzle = () => {
    setSecondsLeft(givenTime);
    setPuzzleIsComplete(false);
    setIsTimerActive(true);
    setMovesTaken(0);
  };

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={params.slug}>
        <div>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-10">
                <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
                  <h1 className="text-lg font-bold">
                    Brown fox jumps over lazy dog
                  </h1>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-10 p-2">
                <TileSelector
                  src="https://studio.arttribute.io/_next/image?url=https%3A%2F%2Fapi.astria.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCTFpTY3djPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--938b0f781e6c32acf24ff91a446f7bddcf390a39%2F15124241-0.jpg&w=640&q=75"
                  numCols={3}
                  secondsLeft={secondsLeft}
                  client={"client"}
                  channelName={params.slug}
                  score={score}
                  givenTime={givenTime}
                  movesTaken={movesTaken}
                  setMovesTaken={setMovesTaken}
                  setScore={setScore}
                  puzzleIsComplete={puzzleIsComplete}
                  setPuzzleIsComplete={setPuzzleIsComplete}
                  handleNextPuzzle={handleNextPuzzle}
                />
              </div>
              <div className="col-span-2 mt-4">
                <PuzzleTimer
                  initialSeconds={60}
                  secondsLeft={secondsLeft}
                  setSecondsLeft={setSecondsLeft}
                  isActive={true}
                  setIsActive={() => {}}
                />
                <MovesDisplay moves={remainingMoves} />
                <ScoreDisplay score={score} />
              </div>
            </div>
          </div>
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}
