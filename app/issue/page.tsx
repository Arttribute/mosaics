"use client"

import { useState } from "react";
import ConnectButton from "@/components/issue-ens/ConnectButton";
import IssueSubdomain from "@/components/issue-ens/IssueSubdomain";

export default function Home() {
  const [account, setAccount] = useState<any | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gray-100">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-800">
          Welcome to <a className="text-blue-600" href="/">Mosaics</a>
        </h1>

        <p className="mt-3 text-2xl text-gray-600">
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
            <p className="text-gray-600">Connected account: {account.address}</p>
          </div>
        )}
      </main>
      <div className="mt-6 w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <IssueSubdomain />
      </div>
    </div>
  );
}