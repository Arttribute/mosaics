"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiplayerLeaderboard from "./MultiplayerLeaderboard";
import SinglePlayerLeaderboard from "./SinglePlayerLeaderboard";

const Leaderboard: React.FC = () => {
  return (
    <Tabs defaultValue="multiplayer" className="w-full">
      <TabsList className="flex mx-auto w-[220px] justify-center mb-4">
        <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
        <TabsTrigger value="singleplayer">Single Player</TabsTrigger>
      </TabsList>
      <TabsContent value="multiplayer">
        <MultiplayerLeaderboard />
      </TabsContent>
      <TabsContent value="singleplayer">
        <SinglePlayerLeaderboard />
      </TabsContent>
    </Tabs>
  );
};

export default Leaderboard;
