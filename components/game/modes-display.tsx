"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useState } from "react";
import axios from "axios";

export default function ModesDisplay() {
  const [loading, setLoading] = useState(false);
  const createRoom = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/huddle/rooms");
      const roomId = res.data.roomId.data.roomId;
      window.location.href = `/games/multiplayer/${roomId}`;
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <Card className="col-span-1 m-2 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold ">😄 Play for fun </h2>
          </CardHeader>
          <CardContent>
            <div className="m-2">
              <h4 className="text-lg font-semibold mb-4">
                Solve AI puzzles, no stakes, just fun
              </h4>
              <div className=" p-2">
                <p className="text-sm mb-4 ml-2 ">
                  Play AI art puzzles just for fun. Compete on the global
                  leaderboard and earn an NFT for puzzles you solve.
                </p>
              </div>
            </div>
            <Link href="/games/play" passHref>
              <Button variant="outline" className="mt-4  w-full">
                <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Start playing
                </p>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-1 m-2 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold ">🤑 Play to earn</h2>
          </CardHeader>
          <CardContent>
            <div className="m-2">
              <h4 className="text-lg font-semibold mb-4">
                Stake, play and earn rewards
              </h4>
              <div className="p-2">
                <p className="text-sm mb-4 ml-2">
                  Stake your FIL and play the AI art puzzle game to earn rewards
                  and NFTs. The more you play, the more you earn.
                </p>
              </div>
            </div>
            <Link href="/games/earn" passHref>
              <Button variant="outline" className="mt-4  w-full">
                <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Stake and earn
                </p>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-1 m-2 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold">🙋🏽 Play with friends</h2>
          </CardHeader>
          <CardContent>
            <div className="m-2">
              <h4 className="text-lg font-semibold mb-4">
                Collaboratively solve AI art puzzles
              </h4>
              <div className="p-2">
                <p className="text-sm mb-4 ml-2">
                  Play the AI art puzzle game with friends and compete to solve
                  puzzles collaboratively. Earn NFT rewards for puzzles you
                  solve.
                </p>
              </div>
            </div>

            {!loading && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={createRoom}
              >
                <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Play with friends
                </p>
              </Button>
            )}
            {loading && (
              <Button variant="outline" className="mt-4 w-full">
                <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Creating room...
                </p>
              </Button>
            )}
          </CardContent>
        </Card>

        <div
          style={{
            boxShadow:
              "0 0 120px 20px #f8bbd0, 0 0 260px 140px #ede7f6, 0 0 200px 160px #ede7f6, 0 0 200px 120px #ede7f6",
            zIndex: -1,
            bottom: "0",
          }}
        ></div>
      </div>
    </>
  );
}
