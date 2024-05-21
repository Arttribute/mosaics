"use client";

import LeaderBoard from "../../components/leaderboard/Leaderboard";

const singlePlayerScores = [
  {
    _id: "1",
    player: {
      name: "Bronson.eth",
    },
    score_value: 1200,
  },
  {
    _id: "2",
    player: {
      name: "Virginia.eth",
    },
    score_value: 1100,
  },
  {
    _id: "3",
    player: {
      name: "Michelle.eth",
    },
    score_value: 1000,
  },
  {
    _id: "4",
    player: {
      name: "Nathan.eth",
    },
    score_value: 950,
  },
];

const multiplayerScores = [
  {
    _id: "1",
    team: {
      name: "Team Alpha",
    },
    score_value: 1300,
  },
  {
    _id: "2",
    team: {
      name: "Team Beta",
    },
    score_value: 1250,
  },
  {
    _id: "3",
    team: {
      name: "Team Gamma",
    },
    score_value: 1150,
  },
  {
    _id: "4",
    team: {
      name: "Team Delta",
    },
    score_value: 1100,
  },
];

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <LeaderBoard
        singlePlayerScores={singlePlayerScores}
        multiplayerScores={multiplayerScores}
      />
    </div>
  );
}
