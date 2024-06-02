"use client";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";
import Multiplayer from "@/components/game/multiplayer";
export default function Game({ params }: { params: { roomId: string } }) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={params.roomId}>
        <Multiplayer roomId={params.roomId} />
      </ChannelProvider>
    </AblyProvider>
  );
}
