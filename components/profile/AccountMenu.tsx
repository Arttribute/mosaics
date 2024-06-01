"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { Coins } from "lucide-react";

export default function AccountMenu() {
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    setAccount(user);
  }, []);

  return (
    <Menubar className="rounded-none border-none px-2 lg:px-4">
      {account ? (
        <MenubarMenu>
          <MenubarTrigger className="flex p-1 border border-purple-600 rounded-full ">
            <div className="overflow-hidden rounded-full">
              <Image
                src={account.profilePicture || "/fallback-avatar.png"}
                alt={account.displayName}
                width={28}
                height={28}
                className="aspect-[1]"
              />
            </div>
            <div className="block ml-2 mr-4 overflow-hidden whitespace-nowrap text-ellipsis">
              <div className="flex">
                <div className="flex text-sm font-semibold">
                  {account.displayName}
                </div>
              </div>
            </div>
          </MenubarTrigger>
          <MenubarContent forceMount>
            <MenubarLabel inset>
              <Link href="/profile" passHref>
                {account.displayName}
              </Link>
            </MenubarLabel>
            <MenubarSeparator />
            <MenubarItem inset>
              <Link href="/profile" passHref>
                <p>Profile</p>
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSeparator />
            <div className="w-full flex justify-center">
              <ConnectButton
                action="Disconnect"
                setAccount={setAccount}
                buttonVariant="outline"
              />
            </div>
          </MenubarContent>
        </MenubarMenu>
      ) : (
        <ConnectButton
          action="Connect account"
          setAccount={setAccount}
          buttonVariant="outline"
        />
      )}
    </Menubar>
  );
}
