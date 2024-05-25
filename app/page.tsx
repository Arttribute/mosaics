"use client"

import { useState } from "react";
import ConnectButton from "@/components/test/ConnectButton";
import IssueSubdomain from "@/components/test/IssueSubdomain";

export default function Home() {
  const [account, setAccount] = useState<any | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-blue-600" href="/">Mosaics</a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by connecting your wallet and registering your username
        </p>

        <div className="mt-6 flex justify-center">
          <ConnectButton action="Connect account" setAccount={setAccount} />
        </div>

        {account && (
          <div className="mt-6 flex justify-center">
            <ConnectButton action="Register subdomain" setAccount={setAccount} />
          </div>
        )}

        {account && account.address && (
          <div className="mt-6">
            <p>Connected account: {account.address}</p>
          </div>
        )}
      </main>
      <IssueSubdomain />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
