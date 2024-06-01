"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const providerOptions = {
  // Configure any additional providers here if needed
};

const ConnectWallet: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (provider && address) {
      fetchENSName();
    }
  }, [provider, address]);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const web3Modal = new Web3Modal({
        network: "sepolia", // Specify network as Sepolia
        cacheProvider: true,
        providerOptions,
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      setProvider(provider);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      // Fetch ENS name immediately after connecting
      const ensName = await provider.lookupAddress(address);
      setEnsName(ensName);

      // Store user information in Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([{ ens_username: ensName || "", eth_address: address }]);

      if (error) {
        console.error("Error storing user information:", error);
      } else {
        setSuccessMessage(
          "Wallet connected and ENS name retrieved successfully!"
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchENSName = async () => {
    if (!provider || !address) return;
    setLoading(true);
    try {
      const ensName = await provider.lookupAddress(address);
      setEnsName(ensName);
    } catch (error) {
      console.error("Error fetching ENS name:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {address ? (
        <div>
          <p>Connected as: {ensName || address}</p>
          {successMessage && <p>{successMessage}</p>}
          <button onClick={() => router.push("/start")}>Start Game</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
