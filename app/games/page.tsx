"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { LoaderCircle } from "lucide-react";
import GameCard from "../../components/game/game-card";

interface Game {
  _id: string;
  game_title: string;
  owner: {
    name: string;
    picture: string;
  };
}

// dummy game data
const dummyGame: Game = {
  _id: '1',
  game_title: 'Game Title',
  owner: {
    name: 'Users Name',
    picture: '',
  },
};

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [account, setAccount] = useState<{ name: string } | null>(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadedAccount, setLoadedAccount] = useState(false);

  const getGames = async () => {
    setLoadingGames(true);
    // Simulate fetching data
    setTimeout(() => {
      const repeatedGames = Array(8).fill(dummyGame);
      setGames(repeatedGames);
      const userJson = localStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      if (user) {
        const myGames = repeatedGames.filter((game) => game.owner.name === user.name);
        setMyGames(myGames);
      }
      setLoadingGames(false);
    }, 1000); // Simulate a network delay
  };

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    setLoadedAccount(true);
    setAccount(user);
    getGames();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <Tabs defaultValue="all-games">
          <div className="flex flex-col items-center justify-center">
            <TabsList className="grid grid-cols-2 w-96 mb-4">
              <TabsTrigger value="all-games" className="font-semibold">
                All games
              </TabsTrigger>
              <TabsTrigger value="my-games" className="font-semibold">
                My games
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all-games">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {loadingGames && (
                <div className="col-span-12 flex flex-col items-center justify-center mt-6">
                  <LoaderCircle size={32} className="animate-spin" />
                </div>
              )}
              {games &&
                games.map((game, index) => (
                  <div key={index}>
                    <GameCard game={game} />
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="my-games">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="col-span-12 text-center mt-6">
                <Link href="/create">
                  <Button className="ml-2 px-8">Create New Game</Button>
                </Link>
              </div>

              {loadingGames && (
                <div className="col-span-12 flex flex-col items-center justify-center mt-6">
                  <LoaderCircle size={32} className="animate-spin" />
                </div>
              )}

              {myGames &&
                myGames.map((game, index) => (
                  <div key={index}>
                    <GameCard game={game} />
                  </div>
                ))}

              {myGames.length === 0 && account && (
                <div className="col-span-12 text-center mt-6">
                  <div className="text-2xl font-semibold text-gray-500">
                    No games yet ...
                  </div>
                  <div className="text-medium font-normal mt-2 text-gray-500">
                    Create a game and share it with your friends
                  </div>
                  <div className="mt-6">
                    <Link href="/create">
                      <Button className="ml-2 px-8">Create Promptles</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
