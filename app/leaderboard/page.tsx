import AppBar from "@/components/layout/AppBar";
import { Suspense } from "react";
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function LeaderboardPage() {
  return (
    <>
      <AppBar />
      <div className="container mx-auto p-4 mt-16">
        <Suspense fallback={<div>Loading...</div>}>
          <Leaderboard />
        </Suspense>
      </div>
    </>
  );
}
