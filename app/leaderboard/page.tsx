import AppBar from "@/components/layout/AppBar";
import SinglePlayerLeaderboard from "@/components/leaderboard/SinglePlayerLeaderboard";

export default function SinglePlayerLeaderboardPage() {
  return (
    <>
      <AppBar />
      <div className="container mx-auto p-4 mt-16">
        <SinglePlayerLeaderboard />
      </div>
    </>
  );
}
