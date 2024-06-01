"use client";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

interface Props {
  action: "Connect account" | "Disconnect";
  buttonVariant?: "ghost" | "outline" | "default";
  setAccount: React.Dispatch<React.SetStateAction<any>>;
}

const profilePictures = [
  "/images/pfp1.png",
  "/images/pfp2.png",
  "/images/pfp3.png",
  "/images/pfp4.png",
  "/images/pfp5.png",
  "/images/pfp6.png",
];

function getRandomProfilePicture() {
  return profilePictures[Math.floor(Math.random() * profilePictures.length)];
}

export default function ConnectButton({
  action,
  buttonVariant,
  setAccount,
}: Props) {
  const [disabled, setDisabled] = useState(false);
  const supabase = createClient(); // Initialize Supabase client

  const fetchUserData = async (address: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("eth_address", address)
      .single(); // Fetch single user data

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    } else {
      console.log("User Data from Supabase:", data);
      localStorage.setItem("user", JSON.stringify(data)); // Store user data in localStorage
      return data;
    }
  };

  const connectWallet = async () => {
    try {
      setDisabled(true);
      const web3Modal = new Web3Modal({
        network: "sepolia",
        cacheProvider: true,
        providerOptions: {},
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      let ensName;
      try {
        ensName = await provider.lookupAddress(address);
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }

      const userData = await fetchUserData(address);
      if (userData) {
        const displayName = userData.ens_username || address;
        const profilePicture = getRandomProfilePicture();
        const updatedUserData = { ...userData, displayName, profilePicture };
        setAccount(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData)); // Update localStorage with profile picture
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setDisabled(false);
    }
  };

  const disconnect = useCallback(async () => {
    try {
      setDisabled(true);
      localStorage.removeItem("user");
      setAccount(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  }, [setAccount]);

  return (
    <div>
      <Button
        variant={buttonVariant || "ghost"}
        size="sm"
        disabled={disabled}
        onClick={action === "Connect account" ? connectWallet : disconnect}
        className="rounded-lg px-8 font-semibold"
      >
        <p
          className={
            action === "Connect account"
              ? "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              : "font-medium"
          }
        >
          {disabled ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-indigo-700" />
          ) : (
            action
          )}
        </p>
      </Button>
    </div>
  );
}
