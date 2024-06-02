"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const Leaderboard: React.FC = () => {
  const supabase = createClient();
  const [scores, setScores] = useState<Score[]>([]);
  const [sortOption, setSortOption] = useState<string>("score");
  const searchParams = useSearchParams();
  const ethAddress = searchParams.get("eth_address");

  const getRandomPicture = () => {
    const pictures = [
      "/images/pfp1.png",
      "/images/pfp2.png",
      "/images/pfp3.png",
      "/images/pfp4.png",
      "/images/pfp5.png",
      "/images/pfp6.png",
    ];
    return pictures[Math.floor(Math.random() * pictures.length)];
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("single_player_leaderboard")
        .select(
          `
          id,
          created_at,
          score,
          time_taken,
          no_of_moves,
          eth_address,
          users (ens_username),
          multiplier,
          stake_amount,
          puzzle_is_complete,
          failed_puzzle
        `
        )
        .order(sortOption, {
          ascending: sortOption === "score" ? false : true,
        });

      if (error) console.log("Error fetching data:", error);
      else {
        const formattedData = data.map((item: any) => ({
          ...item,
          ens_username: item.users.ens_username,
          picture: getRandomPicture(),
        }));
        setScores(formattedData as Score[]);
      }
    };

    fetchData();
  }, [sortOption]);

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
          alt="player picture"
          width={80}
          height={80}
          className="rounded-full object-cover transition-all"
        />
        <div className={`text-xl font-semibold ${styles.text}`}>
          {`${medal} #${index + 1} ${score.ens_username}`}
        </div>
        <div className="text-lg">{value}</div>
        <div className={styles.tooltip}>{score.eth_address}</div>
      </div>
    );
  };

  const topThree = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div
      className={`border rounded-lg p-6 bg-white shadow-lg ${styles.container}`}
    >
      <h1 className={styles.heading}>Leaderboard</h1>
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
            <TableHead>Player</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>No of Moves</TableHead>
            <TableHead>Multiplier</TableHead>
            <TableHead>Stake Amount</TableHead>
            <TableHead>Puzzle Complete</TableHead>
            <TableHead>Failed Puzzle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rest.map((score, index) => (
            <TableRow
              key={score.id}
              className={
                score.eth_address === ethAddress ? styles.highlight : ""
              }
            >
              <TableCell>{index + 4}</TableCell>
              <TableCell>
                <div className={styles.playerCell}>
                  <Image
                    src={score.picture}
                    alt="player picture"
                    width={38}
                    height={38}
                    className="rounded-full object-cover transition-all aspect-[1]"
                  />
                  <span>{score.ens_username}</span>
                  <div className={styles.tooltip}>{score.eth_address}</div>
                </div>
              </TableCell>
              <TableCell>{score.score} pts</TableCell>
              <TableCell>{score.time_taken} seconds</TableCell>
              <TableCell>{score.no_of_moves} moves</TableCell>
              <TableCell>{score.multiplier ?? "N/A"}</TableCell>
              <TableCell>{score.stake_amount ?? "N/A"}</TableCell>
              <TableCell>{score.puzzle_is_complete ? "Yes" : "No"}</TableCell>
              <TableCell>{score.failed_puzzle ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
