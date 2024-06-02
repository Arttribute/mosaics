"use client";
import { useGameLogic } from "@/hooks/useGameLogic";
import TileSelector from "@/components/game/tile-selector";
import PuzzleTimer from "@/components/game/puzzle-timer";
import MovesDisplay from "@/components/game/moves-display";
import ScoreDisplay from "@/components/game/score-display";
import StartGameDisplay from "@/components/game/start-game-display";
import LoadingPuzzleDisplay from "@/components/game/loading-puzzle-display";
import AppBar from "@/components/layout/AppBar";

export default function SinglePlayerGame() {
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

  return (
    <>
      <AppBar />{" "}
      <div className="grid grid-cols-12">
        <div className="col-span-2"></div>
        <div className="col-span-8 mt-28">
          <div className="flex flex-col items-center justify-center">
            {!gameStarted && (
              <StartGameDisplay
                gameTitle="Single Player Game"
                gameStarted={gameStarted}
                onStartGame={initializeGame}
                mode="single"
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
                        score={score}
                        givenTime={givenTime}
                        movesTaken={movesTaken}
                        setMovesTaken={setMovesTaken}
                        setScore={setScore}
                        puzzleIsComplete={puzzleIsComplete}
                        setPuzzleIsComplete={setPuzzleIsComplete}
                        handleNextPuzzle={handleNextPuzzle}
                        failedPuzzle={failedPuzzle}
                        mode="single"
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
        <div className="col-span-2"></div>
      </div>
    </>
  );
}
