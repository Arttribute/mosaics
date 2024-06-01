import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRoom, usePeerIds, useDataMessage } from "@huddle01/react/hooks";

export const useRoomsLogic = (roomId: string) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { sendData } = useDataMessage();
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [remoteCursorPosition, setRemoteCursorPosition] = useState<{
    [key: string]: { top: number; left: number };
  }>({});
  const { joinRoom, leaveRoom, state } = useRoom({
    onJoin: () => console.log("Joined room"),
    onWaiting: (data) => {
      console.log("Waiting for the host to admit you");
      console.log(data.reason);
    },
  });
  const { peerIds } = usePeerIds();

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: "sepolia",
        cacheProvider: true,
        providerOptions: {},
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      setProvider(provider);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      let ensName;
      try {
        ensName = await provider.lookupAddress(address);
        setEnsName(ensName);
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }

      return ensName || address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };

  const getRoomToken = async (displayName: string) => {
    try {
      const tokenResponse = await fetch(
        `/api/huddle/token?roomId=${roomId}&displayName=${displayName}`
      );
      if (!tokenResponse.ok) {
        throw new Error("Failed to get access token");
      }
      const tokenText = await tokenResponse.text();
      setToken(tokenText);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleJoin = async () => {
    const displayName = await connectWallet();
    if (displayName) {
      await getRoomToken(displayName);
    }
  };

  useEffect(() => {
    if (token) {
      joinRoom({
        roomId: roomId,
        token: token,
      });
    }
  }, [token]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cursorWidth = 200;
      const cursorHeight = 150;

      const adjustedTop = Math.min(e.clientY, screenHeight - cursorHeight);
      const adjustedLeft = Math.min(e.clientX, screenWidth - cursorWidth);

      setCursorPosition({
        top: adjustedTop + 15,
        left: adjustedLeft + 15,
      });

      if (state === "connected") {
        sendData({
          to: "*",
          payload: JSON.stringify({
            top: adjustedTop + 15,
            left: adjustedLeft + 15,
            clicked: true,
          }),
          label: "cursor",
        });
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [state, sendData]);

  useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "cursor") {
        const { top, left } = JSON.parse(payload);
        setRemoteCursorPosition((prev) => ({ ...prev, [from]: { top, left } }));
      }
    },
  });

  return {
    state,
    handleJoin,
    leaveRoom,
    remoteCursorPosition,
    peerIds,
  };
};
