import { useCallback, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ensAbi = [
  {
    "inputs": [
      {
        "internalType": "contract ENS",
        "name": "_ens",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_rootNode",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ens",
    "outputs": [
      {
        "internalType": "contract ENS",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "subdomain",
        "type": "string"
      }
    ],
    "name": "registerSubdomain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rootNode",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface Props {
  action: "Connect account" | "Disconnect" | "Register subdomain";
  buttonVariant?: "ghost" | "outline" | "default";
  setAccount: React.Dispatch<React.SetStateAction<any | null>>;
}

export default function ConnectButton({
  action,
  setAccount,
  buttonVariant,
}: Props) {
  const [disabled, setDisabled] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  const connect = useCallback(async () => {
    try {
      setDisabled(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      localStorage.setItem("user", JSON.stringify({ address }));
      setAccount({ address });
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [setAccount]);

  const registerSubdomain = useCallback(async () => {
    if (disabled) return; // Prevent multiple simultaneous requests
    try {
      setDisabled(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS",
        ensAbi,
        signer
      );

      const tx = await contract.registerSubdomain(subdomain);
      await tx.wait();

      alert(`Subdomain ${subdomain}.arttribute.eth registered!`);
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [subdomain]);

  return (
    <>
      {action === "Connect account" || action === "Disconnect" ? (
        <Button
          variant={buttonVariant || "ghost"}
          size="sm"
          disabled={disabled}
          onClick={action === "Connect account" ? connect : () => setAccount(null)}
          className="rounded-lg px-8 font-semibold"
        >
          <p className={action === "Connect account" ? "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent" : "font-medium"}>
            {disabled ? <Loader2 className="mx-auto h-4 w-4 animate-spin text-indigo-700" /> : action}
          </p>
        </Button>
      ) : (
        <>
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            placeholder="Enter ENS username"
            className="border p-2 rounded"
          />
          <Button
            variant={buttonVariant || "ghost"}
            size="sm"
            disabled={disabled}
            onClick={registerSubdomain}
            className="rounded-lg px-8 font-semibold"
          >
            <p className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {disabled ? <Loader2 className="mx-auto h-4 w-4 animate-spin text-indigo-700" /> : "Register subdomain"}
            </p>
          </Button>
        </>
      )}
    </>
  );
}