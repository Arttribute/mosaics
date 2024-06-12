import { MosaicsGameAgentABI } from "@/lib/abi/MosaicsGameAgentABI";
import { Contract, ethers, Wallet } from "ethers";

export const revalidate = 0;

const privateKey = process.env.PRIVATE_KEY!;
const galdrielRpcurl = process.env.GALADRIEL_RPC_URL!;
const contractAddress = process.env.GAME_AGENT_CONTRACT_ADDRESS!;
const provider = new ethers.JsonRpcProvider(galdrielRpcurl);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, MosaicsGameAgentABI, wallet);

const getGameData = async (sessionId: string) => {
  const messages = await contract.getMessageHistoryContents(sessionId);
  console.log("Game Messages:", messages);
  const retrunObject = {
    sessionId,
    messages,
  };
  return retrunObject;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameSessionId = searchParams.get("game_session_id");
  try {
    const gameData = await getGameData(gameSessionId!);
    return Response.json({ status: 200, gameData });
  } catch (error: any) {
    return Response.json({ status: 500, error: error.message });
  }
}
