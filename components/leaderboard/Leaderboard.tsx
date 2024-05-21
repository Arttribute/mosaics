import { useState } from "react";
import styles from "./styles/leaderboard.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaderBoard: React.FC<LeaderBoardProps> = ({
  singlePlayerScores,
  multiplayerScores,
}) => {
  const [mode, setMode] = useState("single"); // Default to single-player mode

  // Sort scores by highest value
  const sortedSinglePlayerScores = [...singlePlayerScores].sort(
    (a, b) => b.score_value - a.score_value
  );
  const sortedMultiplayerScores = [...multiplayerScores].sort(
    (a, b) => b.score_value - a.score_value
  );

  const topThree =
    mode === "single"
      ? sortedSinglePlayerScores.slice(0, 3)
      : sortedMultiplayerScores.slice(0, 3);
  const rest =
    mode === "single"
      ? sortedSinglePlayerScores.slice(3)
      : sortedMultiplayerScores.slice(3);

  // Type guard to check if a score is a single-player score
  const isSinglePlayerScore = (
    score: GameScore | TeamScore
  ): score is GameScore => {
    return (score as GameScore).player !== undefined;
  };

  return (
    <div
      className={`border rounded-lg p-6 bg-white shadow-lg ${styles.container}`}
    >
      <h1 className={styles.heading}>Leaderboard</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setMode("single")}
          className={`mr-4 p-2 ${mode === "single" ? "font-bold" : ""}`}
        >
          Single Player
        </button>
        <button
          onClick={() => setMode("multi")}
          className={`p-2 ${mode === "multi" ? "font-bold" : ""}`}
        >
          Multiplayer
        </button>
      </div>
      <div className={styles.topThree}>
        {topThree.map((score, index) => (
          <div
            key={score._id}
            className={`${styles.rank} ${styles[`rank${index + 1}`]}`}
          >
            <div className={`text-xl font-semibold ${styles.text}`}>
              {`#${index + 1} ${
                isSinglePlayerScore(score) ? score.player.name : score.team.name
              }`}
            </div>
            <div className="text-lg">{score.score_value} pts</div>
          </div>
        ))}
      </div>
      <Table className={styles.table}>
        <TableHeader>
          <TableRow>
            <TableHead>Ranking</TableHead>
            <TableHead>
              {mode === "single" ? "Name (Username)" : "Team Name"}
            </TableHead>
            <TableHead className={styles.textRight}>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rest.map((score, index) => (
            <TableRow key={score._id}>
              <TableCell>{index + 4}</TableCell>
              <TableCell className="font-medium">
                {isSinglePlayerScore(score)
                  ? score.player.name
                  : score.team.name}
              </TableCell>
              <TableCell className={styles.textRight}>
                {score.score_value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderBoard;
