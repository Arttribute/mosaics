"use client";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";
import Multiplayer from "@/components/game/multiplayer";
import AppBar from "@/components/layout/AppBar";

export default function Game({ params }: { params: { roomId: string } }) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <>
      <AppBar />{" "}
      <AblyProvider client={client}>
        <ChannelProvider channelName={params.roomId}>
          <Multiplayer roomId={params.roomId} />
        </ChannelProvider>
      </AblyProvider>
    </>
  );
}
