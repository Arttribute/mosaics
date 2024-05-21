interface Player {
  name: string;
}

interface Team {
  name: string;
}

interface GameScore {
  _id: string;
  player: Player;
  score_value: number;
}

interface TeamScore {
  _id: string;
  team: Team;
  score_value: number;
}

interface LeaderBoardProps {
  singlePlayerScores: GameScore[];
  multiplayerScores: TeamScore[];
}
