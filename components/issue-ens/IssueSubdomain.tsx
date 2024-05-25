"use client"

import React, { useState } from 'react';
import { ethers } from 'ethers';
import NameWrapperABI from './NameWrapper.json'; // Ensure you have the ABI file for the NameWrapper contract
import Web3Modal from "web3modal";

const nameWrapperAddress = "0x0635513f179D50A207757E05759CbD106d7dFcE8"; // Replace with your contract address
const parentNode = ethers.namehash('mosaicz.eth'); // Namehash of 'mosaicz.eth'
const defaultFuses = 0; // Example default value for fuses
const oneYearInSeconds = 31536000; // One year in seconds

const IssueSubdomain: React.FC = () => {
  const [label, setLabel] = useState('');
  const [owner, setOwner] = useState('');

  const handleIssueSubdomain = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const nameWrapperContract = new ethers.Contract(nameWrapperAddress, NameWrapperABI.abi, signer);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expiry = currentTimestamp + oneYearInSeconds;

    console.log('Parameters:');
    console.log('parentNode:', parentNode);
    console.log('label:', label);
    console.log('owner:', owner);
    console.log('fuses:', defaultFuses);
    console.log('expiry:', expiry);

    try {
      const tx = await nameWrapperContract.setSubnodeOwner(
        parentNode, // Hardcoded parent node (mosaicz.eth)
        label,
        owner,
        defaultFuses,
        expiry
      );
      await tx.wait();
      alert('Subdomain issued successfully');
    } catch (error: any) {
      console.error('Error: ', error);
      if (error.code === 'CALL_EXCEPTION') {
        console.error('Call exception: ', error);
        alert('Failed to issue subdomain: ' + (error.reason || 'Unknown custom error'));
      } else {
        console.error('Transaction error: ', error);
        alert('Failed to issue subdomain: ' + error.message);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue Subdomain for mosaicz.eth</h2>
      <input
        type="text"
        placeholder="Label (e.g., sub)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Owner Address"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleIssueSubdomain}
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Issue Subdomain
      </button>
    </div>
  );
};

export default IssueSubdomain;