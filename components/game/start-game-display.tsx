"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Play as PlayIcon } from "lucide-react";
import { SquareArrowOutUpRight } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { playToEarnABI } from "@/lib/abi/PlayToEarnABI";

interface StartGameDisplayProps {
  gameTitle: string;
  joinRoomStatus?: string;
  gameStarted: boolean;
  stakeAmount?: string;
  setStakeAmount?: any;
  onStartGame: () => void;
  onJoinGameRoom?: () => void;
  mode: "single" | "multiplayer" | "earn";
}

export default function StartGameDisplay({
  gameTitle,
  joinRoomStatus,
  gameStarted,
  stakeAmount,
  setStakeAmount,
  onStartGame,
  onJoinGameRoom,
  mode,
}: StartGameDisplayProps) {
  const [joining, setJoining] = React.useState(false);
  const [loadingGame, setLoadingGame] = React.useState(false);
  const [gameInitialized, setGameInitialized] = React.useState(false);

  const handleJoinGameRoom = async () => {
    if (onJoinGameRoom) {
      setJoining(true);
      await onJoinGameRoom();
      setJoining(false);
    }
  };

  const handleStartGame = async () => {
    console.log("Starting game...");
    setLoadingGame(true);
    await onStartGame();
    setLoadingGame(false);
    setGameInitialized(true);
  };

  const handleStakeStartGame = async () => {
    setLoadingGame(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const playToEarnContractAddess =
      process.env.NEXT_PUBLIC_PLAY_TO_EARN_CONTRACT_ADDRESS!;

    const contract = new ethers.Contract(
      playToEarnContractAddess,
      playToEarnABI,
      signer
    );
    contract.stake({ value: ethers.parseEther(stakeAmount!) });
    await onStartGame();
    setLoadingGame(false);
    setGameInitialized(true);
  };

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
            {mode === "multiplayer" && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-base text-gray-500 mt-4 mb-3">
                  Solve AI generated puzzles with friends
                </p>
              </div>
            )}
            {mode === "earn" && (
              <p className="text-base text-gray-500 mt-4">
                Stake and earn for solving puzzles
              </p>
            )}
            {mode === "single" && (
              <p className="text-base text-gray-500 mt-4">
                Solve AI generated puzzles
              </p>
            )}
          </div>
          {loadingGame && (
            <div className="flex items-center justify-center">
              <Loader2 size={32} className="animate-spin" />
            </div>
          )}
          {mode === "multiplayer" ? (
            joinRoomStatus === "connected" ? (
              <Button
                className="rounded-lg mt-1 px-6 w-52"
                onClick={handleStartGame}
              >
                Start Game
                <PlayIcon size={20} className="ml-0.5 w-4 h-4" />
              </Button>
            ) : (
              <div className=" flex flex-col items-center justify-center ">
                <p className="text-xs text-gray-500">
                  {joinRoomStatus === "connected"
                    ? "Room joined successfully"
                    : "Join a room to start game:"}
                </p>

                <Button
                  className="rounded-lg mt-1 px-6 w-52"
                  onClick={handleJoinGameRoom}
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join Game"}
                  <SquareArrowOutUpRight size={20} className="ml-0.5 w-4 h-4" />
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  status: {joinRoomStatus}
                </p>
              </div>
            )
          ) : mode === "earn" ? (
            <div className=" flex flex-col items-center justify-center ">
              <p className="text-xs text-gray-500">
                Enter the amount you want to stake
              </p>
              <Input
                type="text"
                placeholder="0.005"
                className="rounded-lg mt-1 w-52 w-full mb-1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
              <Button
                className="rounded-lg mt-1 px-6 w-full"
                onClick={handleStakeStartGame}
              >
                Stake and Start Game
                <PlayIcon size={20} className="ml-0.5 w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="rounded-lg mt-1 px-6 w-52"
              onClick={handleStartGame}
            >
              Start Game
              <PlayIcon size={20} className="ml-0.5 w-4 h-4" />
            </Button>
          )}
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
