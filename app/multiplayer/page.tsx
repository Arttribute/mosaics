"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NameWrapperABI from "@/components/issue-ens/NameWrapper.json"; // Ensure you have the ABI file for the NameWrapper contract
import Web3Modal from "web3modal";
import { createClient } from "@/utils/supabase/client";
import InvitePlayers from "@/components/issue/InvitePlayers";
import LoadingSpinner from "@/components/issue/LoadingSpinner";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

const nameWrapperAddress = "0x0635513f179D50A207757E05759CbD106d7dFcE8"; // Replace with your contract address
const parentNode = ethers.namehash("mosaicz.eth"); // Namehash of 'mosaicz.eth'
const defaultFuses = 0; // Example default value for fuses
const oneYearInSeconds = 31536000; // One year in seconds

const Multiplayer: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [owner, setOwner] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [ensNames, setEnsNames] = useState<string[]>([]);
  const [subdomainRegistered, setSubdomainRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchEnsNames();
  }, []);

  const fetchEnsNames = async () => {
    const { data, error } = await supabase.from("users").select("ens_username");
    if (error) {
      console.error("Error fetching ENS names:", error);
    } else {
      setEnsNames(
        data.map((user: { ens_username: string }) => user.ens_username)
      );
    }
  };

  const handleRegisterSubdomain = async () => {
    setLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const nameWrapperContract = new ethers.Contract(
      nameWrapperAddress,
      NameWrapperABI.abi,
      signer
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expiry = currentTimestamp + oneYearInSeconds;
    const label = teamName.toLowerCase().replace(/\s+/g, "");

    try {
      const tx = await nameWrapperContract.setSubnodeOwner(
        parentNode,
        label,
        owner,
        defaultFuses,
        expiry
      );
      await tx.wait();
      alert("Subdomain issued successfully");
      setSubdomainRegistered(true);
    } catch (error: any) {
      console.error("Error: ", error);
      if (error.code === "CALL_EXCEPTION") {
        alert(
          "Failed to issue subdomain: " +
            (error.reason || "Unknown custom error")
        );
      } else {
        alert("Failed to issue subdomain: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMembers = async () => {
    const { data, error } = await supabase
      .from("teams")
      .insert([
        { ens_subdomain: `${teamName}.mosaicz.eth`, team_members: players },
      ]);

    if (error) {
      console.error("Error storing team information:", error);
    } else {
      alert("Team members added successfully!");
      router.push("/games");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create a Multiplayer Team
      </h2>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Owner Address"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      {!subdomainRegistered ? (
        <button
          onClick={handleRegisterSubdomain}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Register Subdomain"}
        </button>
      ) : (
        <>
          <InvitePlayers ensNames={ensNames} setPlayers={setPlayers} />
          <button
            onClick={handleAddTeamMembers}
            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Add Team Members
          </button>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Invited Players
            </h3>
            <ul className="list-disc list-inside">
              {players.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Multiplayer;
