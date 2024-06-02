import { useEffect } from "react";
import { Realtime } from "ably";
import { useChannel } from "ably/react";
import { useGameLogic } from "@/hooks/useGameLogic";

export const useMultiplayer = (channelName: string) => {
  const {
    gameStarted,
    setGameStarted,
    movesTaken,
    score,
    puzzleIsComplete,
    secondsLeft,
    isTimerActive,
    initializeGame,
    handleNextPuzzle,
    setMovesTaken,
    setScore,
    setPuzzleIsComplete,
    setSecondsLeft,
    setIsTimerActive,
  } = useGameLogic();

  const { channel } = useChannel(channelName, (message) => {
    if (message.name === "game-update") {
      const data = message.data;
      setMovesTaken(data.movesTaken);
      setScore(data.score);
      setPuzzleIsComplete(data.puzzleIsComplete);
      setSecondsLeft(data.secondsLeft);
      setIsTimerActive(data.isTimerActive);
      setGameStarted(data.gameStarted);
    } else if (message.name === "game-start") {
      setGameStarted(true);
    } else if (message.name === "next-puzzle") {
      handleNextPuzzle();
    }
  });

  const startGame = () => {
    initializeGame();
    setGameStarted(true);
    console.log("game starting in sockets");
    //channel.publish({ name: "game-start", data: {} });
  };

  const nextPuzzle = () => {
    handleNextPuzzle();
    channel.publish({ name: "next-puzzle", data: {} });
  };

  useEffect(() => {
    if (gameStarted) {
      channel.publish({
        name: "game-update",
        data: {
          movesTaken,
          score,
          puzzleIsComplete,
          secondsLeft,
          isTimerActive,
          gameStarted,
        },
      });
    }
  }, [
    gameStarted,
    movesTaken,
    score,
    puzzleIsComplete,
    secondsLeft,
    isTimerActive,
  ]);

  return { startGame, nextPuzzle };
};
