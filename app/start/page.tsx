"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const StartPage: React.FC = () => {
  const [inviteCode, setInviteCode] = useState<string>("");
  const router = useRouter();

  const handleJoinGame = () => {
    router.push(`/join?inviteCode=${inviteCode}`);
  };

  const handleCreateTeam = () => {
    router.push("/multiplayer");
  };

  return (
    <div>
      <h2>Start Game</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button onClick={handleJoinGame}>Join Game</button>
      </div>
      <div>
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>
    </div>
  );
};

export default StartPage;
