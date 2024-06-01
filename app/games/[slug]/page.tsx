"use client";
import Image from "next/image";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import MovesDisplay from "@/components/game/moves-display";
import ScoreDisplay from "@/components/game/score-display";
import { useEffect, useState } from "react";
import { Contract, ethers, TransactionReceipt } from "ethers";
import Web3Modal from "web3modal";
import { MosaicsGameAgentABI } from "@/lib/abi/MosaicsGameAgentABI";
import StartGameDisplay from "@/components/game/start-game-display";
import axios from "axios";

export default function Game({ params }: { params: { slug: string } }) {
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
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [puzzleIsComplete, setPuzzleIsComplete] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [score, setScore] = useState(0);
  //const client = new Ably.Realtime({ authUrl: "/api" });

  const modelId = "690204";

  useEffect(() => {
    setRemainingMoves(10 - movesTaken);
  }, [movesTaken]);

  useEffect(() => {
    if (generationId && imagesData.length === 0) {
      setTimeout(() => {
        getPuzzleImage(generationId, modelId);
      }, 1000);
    }
  }, [generationId, imagesData]);

  useEffect(() => {
    const fetchData = async () => {
      if (imagesData.length > 0) {
        await getImageUrl();
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
    setSecondsLeft(givenTime);
    setPuzzleIsComplete(false);
    setIsTimerActive(false);
    setMovesTaken(0);
  };

  const rpcUrl = "https://devnet.galadriel.com/";
  const contractAddress = "0xce61bbBF8f2873FDd4D6b92adbC4895BbEE87D54";

  const generateNewPuzzle = async (prevPuzzleInfo: any) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, MosaicsGameAgentABI, signer);
    const previousPuzzleInfo = JSON.stringify(prevPuzzleInfo);
    await contract.addMessage(previousPuzzleInfo, gameSession);
    const messages = await contract.getMessageHistoryContents(gameSession);
    console.log("Messages:", messages);
    updateGameData(messages);
  };

  const initializeGame = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, MosaicsGameAgentABI, signer);
    const initialMessage = `You are an assistant. I am currently building a game and will require your help. I am going to use an AI to generate images based on prompts you give me to make puzzles. The prompts could be vague or ultra specific but no more than 12 words. I'm thinking that the more complex image prompts should also be worded more vaguely. Prompts I send you from this point will be in the form {timeTaken: '15s', moves: 12} which corresponds to the user's performance in solving a puzzle from the image generated from the prompt you gave me. Based on the time a user takes to complete the puzzle, the number of moves a user makes, you should adjust the time given to complete a puzzle, the level of difficulty of the puzzle, and the difficulty of the prompt (easy, medium, hard). You can use the first prompt to form a baseline for the user's performance. Also to ensure that the puzzles don't get too crazy, the absolute minimum maximum time you can give the user to solve the puzzle is 15 seconds. Make sure to adjust your parameters to ensure the user stays engaged. Also, make sure you format all your responses in this manner (even the first one): {"prompt":"Prompt goes here", "level": "hard", "timeGiven": "60", "movesGiven":"10"}. You can generate the first prompt now.`;
    const transactionResponse = await contract.startGame(initialMessage);
    const receipt = await transactionResponse.wait();
    let sessionId = getGameSessionId(receipt, contract);
    if (!sessionId && sessionId !== 0) {
      return;
    }
    setGameSession(sessionId);
    //wait 1 second for the transaction
    await new Promise((r) => setTimeout(r, 1000));
    const messages = await contract.getMessageHistoryContents(sessionId);
    console.log("Messages:", messages);
    updateGameData(messages);
    setGameStarted(true);
  };

  const updateGameData = (messages: any) => {
    const keys = Object.keys(messages)
      .map(Number)
      .sort((a, b) => a - b);
    const currentMessage = keys[keys.length - 1];
    console.log("Current message:", currentMessage);
    const gameData = messages[currentMessage];
    const parsedGameData = JSON.parse(gameData);
    setPuzzlePrompt(parsedGameData.prompt);
    setPuzzleLevel(parsedGameData.level);
    setGivenTime(parsedGameData.timeGiven);
    setSecondsLeft(parsedGameData.timeGiven);
    setRemainingMoves(parsedGameData.movesGiven);
    generatePuzzleImage(parsedGameData.prompt);
  };

  function getGameSessionId(receipt: TransactionReceipt, contract: Contract) {
    let sessionId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "GameStarted") {
          sessionId = ethers.toNumber(parsedLog.args[1]);
        }
      } catch (error) {
        console.log("Could not parse log:", log);
      }
    }
    return sessionId;
  }

  const generatePuzzleImage = async (imagePrompt: string) => {
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
      modelId,
    });
    const generationData = await res.data;
    console.log("Generation data:", generationData);
    const generationId = generationData.id.toString();
    setGenerationId(generationId);
  };

  async function getPuzzleImage(generationId: string, modelId: string) {
    try {
      const result = await axios.get(`/api/generation/${generationId}`, {
        params: { model_id: modelId, prompt_id: generationId },
      });
      console.log("Result:", result.data);
      setImagesData(result.data.data.images);
    } catch (error) {
      console.error(error);
    }
  }

  async function getImageUrl() {
    const data = new FormData();
    data.append("file", imagesData[0]);
    data.append("upload_preset", "studio-upload");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/arttribute/upload",
      data
    );
    const puzzleImage = res.data.secure_url;
    console.log("Puzzle image:", puzzleImage);
    setPuzzleImageUrl(puzzleImage);
    setLoadingImage(false);
  }

  return (
    <>
      <AblyProvider client={client}>
        <ChannelProvider channelName={params.slug}>
          <div>
            <div className="flex flex-col items-center justify-center h-screen">
              {!gameStarted && (
                <StartGameDisplay
                  gameTitle={"test"}
                  onStartGame={initializeGame}
                />
              )}
              {gameStarted && (
                <>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-10">
                      <div className="px-4 py-2 mx-8 mb-4 bg-amber-50 rounded-xl text-center max-w-96">
                        <h1 className="text-lg font-bold">
                          {puzzlePrompt ? puzzlePrompt : "Loading..."}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-10 p-2">
                      {imagesData.length === 0 ? (
                        <p>Loading image...</p>
                      ) : (
                        <TileSelector
                          src={puzzleImageUrl}
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
        </ChannelProvider>
      </AblyProvider>
    </>
  );
}
