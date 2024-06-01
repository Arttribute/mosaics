"use client";
import { useState, useEffect } from "react";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { Button } from "@/components/ui/button";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";
import MovesDisplay from "@/components/game/moves-display";
import ScoreDisplay from "@/components/game/score-display";
import StartGameDisplay from "@/components/game/start-game-display";
import LoadingPuzzleDisplay from "@/components/game/loading-puzzle-display";
import LocalPeerData from "@/components/huddle/LocalPeerData";
import PeerData from "@/components/huddle/PeerData";
import PeerCursor from "@/components/huddle/PeerCursor";
import { useRoom, usePeerIds, useDataMessage } from "@huddle01/react/hooks";
import AppBar from "@/components/layout/AppBar";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useRoomsLogic } from "@/hooks/useRoomsLogic";

export default function Game({ params }: { params: { roomId: string } }) {
  const {
    gameStarted,
    loadingPrompt,
    puzzlePrompt,
    imagesData,
    loadingImage,
    puzzleImageUrl,
    score,
    secondsLeft,
    givenTime,
    movesTaken,
    remainingMoves,
    isTimerActive,
    puzzleIsComplete,
    failedPuzzle,
    initializeGame,
    handleNextPuzzle,
    setMovesTaken,
    setScore,
    setPuzzleIsComplete,
    setSecondsLeft,
    setIsTimerActive,
  } = useGameLogic();

  const { state, handleJoin, leaveRoom, remoteCursorPosition, peerIds } =
    useRoomsLogic(params.roomId);

  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={params.roomId}>
        <AppBar />
        <div className="grid grid-cols-12">
          <div className="col-span-2"></div>
          <div className="col-span-8 mt-28">
            <div className="flex flex-col items-center justify-center ">
              {!gameStarted && (
                <StartGameDisplay
                  gameTitle={"test"}
                  onStartGame={initializeGame}
                  onJoinGameRoom={handleJoin}
                  joinRoomStatus={state}
                  gameStarted={gameStarted}
                />
              )}
              {gameStarted && (
                <>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-10">
                      <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
                        <h1 className="text-lg font-bold">
                          {loadingPrompt ? "Loading prompt..." : puzzlePrompt}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-10 p-2">
                      {imagesData.length === 0 || loadingImage ? (
                        <LoadingPuzzleDisplay gameScore={score} />
                      ) : (
                        <TileSelector
                          src={puzzleImageUrl}
                          numCols={3}
                          secondsLeft={secondsLeft}
                          client={"client"}
                          channelName={params.roomId}
                          score={score}
                          givenTime={givenTime}
                          movesTaken={movesTaken}
                          setMovesTaken={setMovesTaken}
                          setScore={setScore}
                          puzzleIsComplete={puzzleIsComplete}
                          setPuzzleIsComplete={setPuzzleIsComplete}
                          handleNextPuzzle={handleNextPuzzle}
                          failedPuzzle={failedPuzzle}
                        />
                      )}
                    </div>
                    <div className="col-span-2 mt-4">
                      <PuzzleTimer
                        initialSeconds={givenTime}
                        secondsLeft={secondsLeft}
                        setSecondsLeft={setSecondsLeft}
                        isActive={isTimerActive}
                        setIsActive={setIsTimerActive}
                      />
                      <MovesDisplay moves={remainingMoves} />
                      <ScoreDisplay score={score} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="mt-20">
              {state === "connected" && (
                <>
                  <div className="w-[168px] m-2">
                    <LocalPeerData />
                    <Button onClick={leaveRoom} className="mt-2 w-full">
                      Leave Room
                    </Button>
                  </div>
                  <div>
                    {peerIds.map((peerId: any) => (
                      <div key={peerId} className="w-[168px] m-2">
                        <PeerData peerId={peerId} />
                      </div>
                    ))}
                  </div>
                  <div>
                    {peerIds.map((peerId: any) => (
                      <div
                        key={peerId}
                        style={{
                          position: "absolute",
                          ...remoteCursorPosition[peerId],
                          zIndex: 1000,
                        }}
                      >
                        <PeerCursor peerId={peerId} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}
