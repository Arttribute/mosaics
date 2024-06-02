interface Player {
  name: string;
}

interface Team {
  name: string;
}

interface GameScore {
  id: string;
  player: Player;
  score: number;
}

interface TeamScore {
  id: string;
  team: Team;
  score: number;
}

interface LeaderboardScore {
  id: number;
  created_at: string;
  level: number;
  score: number;
  time_taken: number;
  no_of_moves: number;
  meeting_id: string;
}

interface Score {
  failed_puzzle: any;
  puzzle_is_complete: any;
  stake_amount: string;
  multiplier: string;
  id: number;
  created_at: string;
  level: number;
  score: number;
  time_taken: number;
  no_of_moves: number;
  eth_address: string;
  ens_username: string;
  picture: string;
}

interface Participant {
  displayName: string;
  walletAddress: string | null;
}

interface Score {
  id: number;
  created_at: string;
  level: number;
  score: number;
  time_taken: number;
  no_of_moves: number;
  meeting_id: string;
  participants: Participant[];
  picture: string;
}
