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

  const nextPuzzle = () => {
    handleNextPuzzle();
    if (mode === "earn") {
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

    router.push("/");
  };

  let channel: any;
  if (mode === "multiplayer" && channelName) {
    ({ channel } = useChannel(channelName, (message) => {
      if (message.name === "puzzle-update") {
        setShuffledPositions(message.data.positions);
        setMovesTaken(message.data.movesTaken);
        setScore(message.data.score);
        setPuzzleIsComplete(message.data.puzzleIsComplete);
        if (message.data.puzzleIsComplete) {
          updateScore(message.data.movesTaken, message.data.score);
        }
      }
    }));
  }

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

    fetchImage(src).then((dataUrl) => {
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
    });

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
      if (mode === "multiplayer" && channel) {
        channel.publish({
          name: "puzzle-update",
          data: {
            positions: newPositions,
            movesTaken: movesTaken + 1,
            score,
            puzzleIsComplete,
          },
        });
      }
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

  const updateScore = (movesTaken?: number, score?: number) => {
    const baseScore = 100;
    const timePenalty = 0.1;
    const movesPenalty = 1;
    const timeLeft = secondsLeft;
    if (puzzleIsComplete) {
      const totalMovesPenalty = movesPenalty * (movesTaken || 0);
      const totalTimePenalty = Math.round(timePenalty * (givenTime - timeLeft));
      const promptleScore = baseScore - totalMovesPenalty - totalTimePenalty;
      setScore((score || 0) + promptleScore);
      if (mode === "multiplayer" && channel) {
        channel.publish({
          name: "puzzle-update",
          data: {
            positions: shuffledPositions,
            movesTaken,
            score: (score || 0) + promptleScore,
            puzzleIsComplete,
          },
        });
      }
    }
  };

  return (
    <div>
      <div className="w-96 h-96 relative">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className={`grid grid-cols-3`}>
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
