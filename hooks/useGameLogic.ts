import { useState, useEffect } from "react";
import axios from "axios";
import { set } from "zod";

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSession, setGameSession] = useState<number | null>(null);
  const [generationId, setGenerationId] = useState<string>("");
  const [puzzlePrompt, setPuzzlePrompt] = useState<string>("");
  const [puzzleImageUrl, setPuzzleImageUrl] = useState<string>("");
  const [imagesData, setImagesData] = useState<any[]>([]);
  const [puzzleLevel, setPuzzleLevel] = useState<string>("");
  const [movesTaken, setMovesTaken] = useState(0);
  const [remainingMoves, setRemainingMoves] = useState(10);
  const [givenTime, setGivenTime] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [puzzleIsComplete, setPuzzleIsComplete] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [gameAgentMessages, setGameAgentMessages] = useState<any>(null);
  const [failedPuzzle, setFailedPuzzle] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setRemainingMoves(10 - movesTaken);
  }, [movesTaken]);

  useEffect(() => {
    if (puzzleIsComplete) {
      setIsTimerActive(false);
    }
  }, [puzzleIsComplete]);

  useEffect(() => {
    if (secondsLeft === 0 || remainingMoves === 0) {
      setFailedPuzzle(true);
      setIsTimerActive(false);
    }
  }, [secondsLeft, remainingMoves]);

  useEffect(() => {
    if (generationId && imagesData.length === 0) {
      setTimeout(() => {
        getPuzzleImage(generationId, "690204");
      }, 500);
    }
    console.log("awaiting image data...");
  }, [generationId, imagesData]);

  // Fetch image data again if the imagesData state changes
  useEffect(() => {
    const fetchData = async () => {
      if (imagesData.length > 0) {
        await fetchImageUrl();
      }
    };
    console.log("fetching image again and again data...");
    fetchData();
  }, [imagesData]);

  useEffect(() => {
    if (gameAgentMessages && Object.keys(gameAgentMessages).length === 1) {
      getGameData(gameSession!);
    }
    if (gameAgentMessages && Object.keys(gameAgentMessages).length > 1) {
      updateGameData(gameAgentMessages);
      console.log("Game ought to be started now...");
      setGameStarted(true);
    }
  }, [gameAgentMessages]);

  useEffect(() => {
    const fetchData = async () => {
      if (imagesData.length > 0) {
        setSecondsLeft(givenTime);
        setIsTimerActive(false);
        await fetchImageUrl();
        setIsTimerActive(true);
      }
    };

    fetchData();
  }, [imagesData]);

  const handleNextPuzzle = () => {
    generateNewPuzzle({
      timeTaken: givenTime - secondsLeft,
      moves: movesTaken,
    });
    setImagesData([]);
    setPuzzleImageUrl("");
    setPuzzlePrompt("");
    setSecondsLeft(givenTime);
    setPuzzleIsComplete(false);
    setIsTimerActive(false);
    setMovesTaken(0);
  };

  const generateNewPuzzle = async (prevPuzzleInfo: any) => {
    setLoadingImage(true);
    setLoadingPrompt(true);
    const previousPuzzleInfo = JSON.stringify(prevPuzzleInfo);
    try {
      const res = await axios.post("/api/galadriel", {
        prevPuzzleInfo: previousPuzzleInfo,
        gameSessionId: gameSession,
      });
      const gameData = res.data.gameData;
      setGameAgentMessages(gameData.messages);
      setLoadingPrompt(false);
    } catch (error) {
      console.error(error);
    }
  };

  const initializeGame = async () => {
    try {
      setLoadingPrompt(true);
      const res = await axios.get("/api/galadriel");
      const gameData = res.data.gameData;
      setGameSession(gameData.sessionId);
      setGameAgentMessages(gameData.messages);
      setLoadingPrompt(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getGameData = async (sessionId: number) => {
    try {
      setLoadingPrompt(true);
      const res = await axios.get(`/api/galadriel/${sessionId}`, {
        params: { game_session_id: sessionId },
      });
      const gameData = res.data.gameData;
      console.log("getting game data...");
      console.log("game data:", gameData);
      setGameAgentMessages(gameData.messages);
      setLoadingPrompt(false);
      return gameData;
    } catch (error) {
      console.error(error);
    }
  };

  const updateGameData = (messages: any) => {
    const keys = Object.keys(messages)
      .map(Number)
      .sort((a, b) => a - b);
    const currentMessage = keys[keys.length - 1];
    const gameData = messages[currentMessage];
    const parsedGameData = JSON.parse(gameData);
    setPuzzlePrompt(parsedGameData.prompt);
    setPuzzleLevel(parsedGameData.level);
    setIsTimerActive(false);
    setGivenTime(parsedGameData.timeGiven);
    setSecondsLeft(parsedGameData.timeGiven);
    setRemainingMoves(parsedGameData.movesGiven);
    generatePuzzleImage(parsedGameData.prompt);
  };

  const generatePuzzleImage = async (imagePrompt: string) => {
    try {
      const textToImageObject = {
        text: imagePrompt,
        negative_prompt: "",
        super_resolution: true,
        face_correct: true,
        num_images: 1,
        callback: 0,
      };
      const res = await axios.post("/api/generation", {
        textToImageObject,
        modelId: "690204",
      });
      console.log("initiating image generation...");
      const generationData = await res.data;
      const generationId = generationData.id.toString();
      setGenerationId(generationId);
    } catch (error) {
      console.error(error);
    }
  };

  const getPuzzleImage = async (generationId: string, modelId: string) => {
    try {
      const result = await axios.get(`/api/generation/${generationId}`, {
        params: { model_id: modelId, prompt_id: generationId },
      });
      console.log("getting image data...");
      setImagesData(result.data.data.images);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImageUrl = async () => {
    const data = new FormData();
    data.append("file", imagesData[0]);
    data.append("upload_preset", "studio-upload");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/arttribute/upload",
      data
    );
    console.log("image uploaded");
    const puzzleImage = res.data.secure_url;
    setPuzzleImageUrl(puzzleImage);
    setLoadingImage(false);
    setIsTimerActive(true);
  };

  return {
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
    setPuzzlePrompt,
    setPuzzleImageUrl,
    setLoadingPrompt,
    setLoadingImage,
    setGameStarted,
    initializeGame,
    handleNextPuzzle,
    setMovesTaken,
    setScore,
    setPuzzleIsComplete,
    setSecondsLeft,
    setIsTimerActive,
  };
};
