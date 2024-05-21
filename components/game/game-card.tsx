import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

export default function GameCard({ game }: { game: any }) {
  return (
    <Link href={`/games/${game._id}`}>
      <Card className="m-2 p-4 shadow-md rounded-lg">
        <Image
          src="/puzzle1.jpeg"
          width={200}
          height={200}
          alt={"game"}
          className="aspect-square rounded-md m-1"
        />

        <div className="flex m-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={game.owner?.picture} alt={game.owner?.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2 mt-1">
            <Label className="font-semibold">{game.game_title}</Label>
            <Label className="text-xs text-gray-500">by {game.owner?.name}</Label>
          </div>
        </div>
      </Card>
    </Link>
  );
}
