"use client";
import { useEffect, useRef, useState } from "react";
import { useChannel } from "ably/react";
import SuccessDialog from "./success-dialog";
import FailedDialog from "./failed-dialog";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { MosaicsNFTRewardABI } from "@/lib/abi/MosaicsNFTRewardABI";
import { playToEarnABI } from "@/lib/abi/PlayToEarnABI";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

interface Props {
  src: string;
  numCols: number;
  client: any;
  score: number;
  secondsLeft: number;
  givenTime: number;
  movesTaken: number;
  channelName?: string;
  setMovesTaken: any;
  setScore: any;
  stakeAmount?: string;
  multiplier?: number;
  setMultiplier?: any;
  puzzleIsComplete: boolean;
  setPuzzleIsComplete: any;
  handleNextPuzzle: () => void;
  failedPuzzle: boolean;
  mode: "single" | "multiplayer" | "earn";
}

const TileSelector: React.FC<Props> = ({
  src,
  numCols,
  client,
  secondsLeft,
  channelName,
  score,
  movesTaken,
  setMovesTaken,
  givenTime,
  setScore,
  stakeAmount,
  multiplier,
  setMultiplier,
  puzzleIsComplete,
  setPuzzleIsComplete,
  handleNextPuzzle,
  failedPuzzle,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<{ id: number; img: string }[]>([]);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const numRows = numCols;
  const router = useRouter();
  const supabase = createClient();

  const nextPuzzle = () => {
    handleNextPuzzle();
    if (mode === "earn" && setMultiplier) {
      setMultiplier((multiplier ?? 0) + 0.01);
    }
  };

  const leaveGame = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const mosaicsNFTRewardContractAddress =
      process.env.NEXT_PUBLIC_MOSAICS_NFT_REWARD_CONTRACT_ADDRESS!;

    const playToEarnContractAddess =
      process.env.NEXT_PUBLIC_PLAY_TO_EARN_CONTRACT_ADDRESS!;

    const playToEarnContract = new ethers.Contract(
      playToEarnContractAddess,
      playToEarnABI,
      signer
    );

    const mosaicsNFTRewardContract = new ethers.Contract(
      mosaicsNFTRewardContractAddress,
      MosaicsNFTRewardABI,
      signer
    );

    if (mode === "earn" && multiplier) {
      await playToEarnContract.completeGame(!failedPuzzle, multiplier * 100);
    }

    if (!failedPuzzle) {
      const tokenUri = "https://mosaicsnft.com/api/metadata/1";
      await mosaicsNFTRewardContract.mint(address, tokenUri);
    }

    // Check if the user already has an entry in the leaderboard
    const { data, error } = await supabase
      .from("single_player_leaderboard")
      .select("*")
      .eq("eth_address", address)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking existing entry:", error);
      return;
    }

    if (data) {
      // Update the existing entry
      await supabase
        .from("single_playerleaderboard")
        .update({
          score,
          time_taken: givenTime - secondsLeft,
          no_of_moves: movesTaken,
          multiplier,
          stake_amount: stakeAmount,
          puzzle_is_complete: puzzleIsComplete,
          failed_puzzle: failedPuzzle,
        })
        .eq("eth_address", address);
    } else {
      // Insert a new entry
      await supabase.from("single_player_leaderboard").insert([
        {
          eth_address: address,
          score,
          time_taken: givenTime - secondsLeft,
          no_of_moves: movesTaken,
          multiplier,
          stake_amount: stakeAmount,
          puzzle_is_complete: puzzleIsComplete,
          failed_puzzle: failedPuzzle,
        },
      ]);
    }

    // Navigate to the new leaderboard route with the user's Ethereum address
    router.push(`/leaderboard?eth_address=${address}`);
  };

  let channel: any;

  useEffect(() => {
    if (puzzleIsComplete) {
      updateScore();
    }
  }, [puzzleIsComplete]);

  useEffect(() => {
    const fetchImage = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    const processImage = (dataUrl: string) => {
      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const pieceWidth = Math.floor(image.width / numCols);
        const pieceHeight = Math.floor(image.height / numRows);

        const tempPieces: { id: number; img: string }[] = [];
        const tempPositions: number[] = [];

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const piece = ctx.getImageData(
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight
            );
            const pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const pieceCtx = pieceCanvas.getContext("2d");
            pieceCtx?.putImageData(piece, 0, 0);

            tempPieces.push({
              id: row * numCols + col,
              img: pieceCanvas.toDataURL(),
            });
            tempPositions.push(row * numCols + col);
          }
        }

        setPieces(tempPieces);

        for (let i = tempPositions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tempPositions[i], tempPositions[j]] = [
            tempPositions[j],
            tempPositions[i],
          ];
        }
        setShuffledPositions(tempPositions);

        URL.revokeObjectURL(dataUrl);
      };
    };

    fetchImage(src).then(processImage);

    console.log("puzzle pieces", pieces);
  }, [src]);

  const handleDragStart = (event: React.DragEvent, id: number) => {
    event.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const sourceId = parseInt(event.dataTransfer.getData("text/plain"));
    const targetId = parseInt(event.currentTarget.id);
    if (sourceId !== targetId) {
      const newPositions = [...shuffledPositions];
      const sourceIndex = newPositions.indexOf(sourceId);
      const targetIndex = newPositions.indexOf(targetId);
      [newPositions[sourceIndex], newPositions[targetIndex]] = [
        newPositions[targetIndex],
        newPositions[sourceIndex],
      ];
      setShuffledPositions(newPositions);
      setMovesTaken((prev: number) => prev + 1);
      checkCompletion(newPositions);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const checkCompletion = (positions: number[]) => {
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] !== i) {
        setPuzzleIsComplete(false);
        return;
      }
    }
    setPuzzleIsComplete(true);
  };

  const updateScore = () => {
    const baseScore = 100;
    const timePenalty = 0.1;
    const movesPenalty = 1;
    const timeLeft = secondsLeft;
    if (puzzleIsComplete) {
      const totalMovesPenalty = movesPenalty * movesTaken;
      const totalTimePenalty = Math.round(timePenalty * (givenTime - timeLeft));
      const promptleScore = baseScore - totalMovesPenalty - totalTimePenalty;
      setScore(score + promptleScore);
    }
  };

  return (
    <div>
      <div className="w-96 h-96 relative">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className={`grid grid-cols-${numCols}`}>
          {shuffledPositions.map((position, index) => (
            <img
              key={index}
              id={pieces[position].id.toString()}
              src={pieces[position].img}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, pieces[position].id)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="p-[0.8px] col-span-1 rounded-md cursor-pointer hover:shadow-2xl transition duration-200 ease-in-out"
            />
          ))}
        </div>
      </div>
      <SuccessDialog
        open={puzzleIsComplete}
        solution={src}
        onContinue={nextPuzzle}
        onLeaveGame={leaveGame}
        mode={mode}
        stakeAmount={stakeAmount}
        multiplier={multiplier}
      />
      <FailedDialog
        open={failedPuzzle}
        solution={src}
        timeRemaining={secondsLeft}
        movesRemaining={givenTime}
        onLeaveGame={leaveGame}
      />
    </div>
  );
};

export default TileSelector;
