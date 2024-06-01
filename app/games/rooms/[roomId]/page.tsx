"use client";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import MovesDisplay from "@/components/game/moves-display";
import ScoreDisplay from "@/components/game/score-display";
import { use, useEffect, useState } from "react";
import { Contract, ethers, TransactionReceipt } from "ethers";
import Web3Modal from "web3modal";
import StartGameDisplay from "@/components/game/start-game-display";
import axios from "axios";
import { Button } from "@/components/ui/button";

import LocalPeerData from "@/components/huddle/LocalPeerData";
import PeerData from "@/components/huddle/PeerData";
import PeerCursor from "@/components/huddle/PeerCursor";
import { useRoom, usePeerIds, useDataMessage } from "@huddle01/react/hooks";
import AppBar from "@/components/layout/AppBar";
import LoadinPuzzleDisplay from "@/components/game/loading-puzzle-display";

export default function Game({ params }: { params: { roomId: string } }) {
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
  const client = new Ably.Realtime({ authUrl: "/api" });

  const modelId = "690204";

  useEffect(() => {
    setRemainingMoves(10 - movesTaken);
  }, [movesTaken]);

  useEffect(() => {
    if (secondsLeft === 0 || remainingMoves === 0) {
      setFailedPuzzle(true);
    }
  }, [secondsLeft, remainingMoves]);

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
        setSecondsLeft(givenTime);
        setIsTimerActive(false);
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
      console.log("Game data:", gameData);
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
      console.log("Response:", res.data);
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
      setLoadingPrompt(false);
      return gameData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (gameAgentMessages && Object.keys(gameAgentMessages).length === 1) {
      getGameData(gameSession!);
    }
    if (gameAgentMessages && Object.keys(gameAgentMessages).length > 1) {
      updateGameData(gameAgentMessages);
      setGameStarted(true);
    }
  }, [gameAgentMessages]);

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
    setIsTimerActive(false);
    setGivenTime(parsedGameData.timeGiven);
    setSecondsLeft(parsedGameData.timeGiven);
    setRemainingMoves(parsedGameData.movesGiven);
    generatePuzzleImage(parsedGameData.prompt);
  };

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
  //================================================================================================
  //Huddle 01
  //================================================================================================

  const roomId = params.roomId;
  console.log(roomId);
  const [token, setToken] = useState<string | null>(null);
  const { sendData } = useDataMessage();
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [remoteCursorPosition, setRemoteCursorPosition] = useState<{
    [key: string]: { top: number; left: number };
  }>({});

  //Room Hooks
  const { joinRoom, leaveRoom, room, state } = useRoom({
    onJoin: () => console.log("Joined room"),
    onWaiting: (data) => {
      console.log("Waiting for the host to admit you");
      console.log(data.reason);
    },
  });

  //Remote Peer Hooks
  const { peerIds } = usePeerIds();

  console.log("Remote Peers: ", peerIds);

  const getRoomToken = async (displayName: string) => {
    try {
      const tokenResponse = await fetch(
        `/api/huddle/token?roomId=${roomId}&displayName=${displayName}`
      );
      if (!tokenResponse.ok) {
        throw new Error("Failed to get access token");
      }
      const tokenText = await tokenResponse.text();
      setToken(tokenText);
      console.log(tokenText);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleJoin = async () => {
    //use wallet address as display name - replace this with ENS name
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    await getRoomToken(address);
  };

  useEffect(() => {
    if (token) {
      joinRoom({
        roomId: roomId,
        token: token,
      });
    }
  }, [token]);

  console.log(peerIds);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cursorWidth = 200; // adjust as needed
      const cursorHeight = 150; // adjust as needed

      // Adjust the cursor position to stay within the screen
      const adjustedTop = Math.min(e.clientY, screenHeight - cursorHeight);
      const adjustedLeft = Math.min(e.clientX, screenWidth - cursorWidth);

      setCursorPosition({
        top: adjustedTop + 15,
        left: adjustedLeft + 15,
      });

      if (state === "connected") {
        sendData({
          to: "*",
          payload: JSON.stringify({
            top: adjustedTop + 15,
            left: adjustedLeft + 15,
            clicked: true,
          }),
          label: "cursor",
        });
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Receive the cursor position data from remote peers
  useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "cursor") {
        const { top, left, clicked } = JSON.parse(payload);
        console.log("User 2 moves their cursor");
        setRemoteCursorPosition((prev) => ({ ...prev, [from]: { top, left } }));
      }
    },
  });

  return (
    <>
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
                          <LoadinPuzzleDisplay gameScore={score} />
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

            <div className="col-span-2 ">
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
                      {peerIds.map((peerId) => (
                        <div key={peerId} className="w-[168px] m-2">
                          <PeerData peerId={peerId} />
                        </div>
                      ))}
                    </div>

                    <div>
                      {peerIds.map((peerId) => (
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
    </>
  );
}
