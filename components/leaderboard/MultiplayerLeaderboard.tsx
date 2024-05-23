"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import styles from "./styles/leaderboard.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MultiplayerLeaderboard: React.FC = () => {
  const supabase = createClient();
  const [scores, setScores] = useState<Score[]>([]);
  const [sortOption, setSortOption] = useState<string>("score");

  const getRandomPicture = () => {
    const pictures = [
      "/images/gpfp1.png",
      "/images/gpfp2.png",
      "/images/gpfp3.png",
      "/images/gpfp4.png",
      "/images/gpfp5.png",
      "/images/gpfp6.png",
    ];
    return pictures[Math.floor(Math.random() * pictures.length)];
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("multiplayer_leaderboard")
        .select(
          `
          id,
          created_at,
          level,
          score,
          time_taken,
          no_of_moves,
          meeting_id,
          meetings (participants)
        `
        )
        .order(sortOption, {
          ascending: sortOption === "score" ? false : true,
        });

      if (error) console.log("Error fetching data:", error);
      else {
        const formattedData = data.map((item: any) => ({
          ...item,
          participants: item.meetings.participants,
          picture: getRandomPicture(),
        }));
        setScores(formattedData as Score[]);
      }
    };

    fetchData();
  }, [sortOption]);

  const levelMapper = (level: number) => {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const renderTopThree = (score: Score, index: number) => {
    const value =
      sortOption === "score"
        ? `${score.score} pts`
        : sortOption === "time_taken"
        ? `${score.time_taken} seconds`
        : `${score.no_of_moves} moves`;

    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

    return (
      <div
        key={score.id}
        className={`${styles.rank} ${styles[`rank${index + 1}`]}`}
      >
        <Image
          src={score.picture}
          alt="team picture"
          width={80}
          height={80}
          className="rounded-full object-cover transition-all"
        />
        <div className={`text-xl font-semibold ${styles.text}`}>
          {`${medal} #${index + 1} Team ${score.meeting_id}`}
        </div>
        <div className="text-lg">{value}</div>
        <div className={styles.tooltip}>
          {score.participants.map((participant, idx) => (
            <div key={idx}>{participant.displayName}</div>
          ))}
        </div>
      </div>
    );
  };

  const topThree = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div
      className={`border rounded-lg p-6 bg-white shadow-lg ${styles.container}`}
    >
      <h1 className={styles.heading}>Multiplayer Leaderboard</h1>
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="p-2 border rounded"
        >
          <option value="score">Score</option>
          <option value="time_taken">Time Taken</option>
          <option value="no_of_moves">Number of Moves</option>
        </select>
      </div>
      <div className={styles.topThree}>
        {topThree.map((score, index) => renderTopThree(score, index))}
      </div>
      <Table className={styles.table}>
        <TableHeader>
          <TableRow>
            <TableHead>Ranking</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>No of Moves</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rest.map((score, index) => (
            <TableRow key={score.id}>
              <TableCell>{index + 4}</TableCell>
              <TableCell>
                <div className={styles.playerCell}>
                  <Image
                    src={score.picture}
                    alt="team picture"
                    width={38}
                    height={38}
                    className="rounded-full object-cover transition-all aspect-[1]"
                  />
                  <span>Team {score.meeting_id}</span>
                  <div className={styles.tooltip}>
                    {score.participants.map((participant, idx) => (
                      <div key={idx}>{participant.displayName}</div>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>{levelMapper(score.level)}</TableCell>
              <TableCell>{score.score} %</TableCell>
              <TableCell>{score.time_taken} seconds</TableCell>
              <TableCell>{score.no_of_moves} moves</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MultiplayerLeaderboard;
