import { MosaicsGameAgentABI } from "@/lib/abi/MosaicsGameAgentABI";
import { Contract, ethers, TransactionReceipt, Wallet } from "ethers";

export const revalidate = 0;

const privateKey = process.env.PRIVATE_KEY!;
const galdrielRpcurl = process.env.GALADRIEL_RPC_URL!;
const contractAddress = process.env.GAME_AGENT_CONTRACT_ADDRESS!;
const provider = new ethers.JsonRpcProvider(galdrielRpcurl);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, MosaicsGameAgentABI, wallet);

const initializeGame = async () => {
  const initialMessage = `You are an assistant. I am currently building a game and will require your help. I am going to use an AI to generate images based on prompts you give me to make puzzles. The prompts could be vague or ultra specific but no more than 12 words. I'm thinking that the more complex image prompts should also be worded more vaguely. Prompts I send you from this point will be in the form {timeTaken: '15s', moves: 12} which corresponds to the user's performance in solving a puzzle from the image generated from the prompt you gave me. Based on the time a user takes to complete the puzzle, the number of moves a user makes, you should adjust the time given to complete a puzzle, the level of difficulty of the puzzle, and the difficulty of the prompt (easy, medium, hard). You can use the first prompt to form a baseline for the user's performance. Also to ensure that the puzzles don't get too crazy, the absolute minimum maximum time you can give the user to solve the puzzle is 30 seconds. Make sure to adjust your parameters to ensure the user stays engaged. Also, make sure you format all your responses in this manner (even the first one): {"prompt":"Prompt goes here", "level": "hard", "timeGiven": "60", "movesGiven":"20"}. You can generate the first prompt now.`;
  const transactionResponse = await contract.startGame(initialMessage);
  const receipt = await transactionResponse.wait();
  let sessionId = getGameSessionId(receipt, contract);
  if (!sessionId && sessionId !== 0) {
    return;
  }
  console.log("Session ID:", sessionId);
  const messages = await contract.getMessageHistoryContents(sessionId);
  console.log("Messages:", messages);
  console.log("Game initialized...");
  const retrunObject = {
    sessionId,
    messages,
  };
  return retrunObject;
};

const generateNewPuzzle = async (prevPuzzleInfo: any, sessionId: string) => {
  const previousPuzzleInfo = JSON.stringify(prevPuzzleInfo);
  await contract.addMessage(previousPuzzleInfo, sessionId);
  const messages = await contract.getMessageHistoryContents(sessionId);
  console.log("Messages:", messages);
  console.log("Puzzle generated...");
  const retrunObject = {
    sessionId,
    messages,
  };
  return retrunObject;
};

function getGameSessionId(receipt: TransactionReceipt, contract: Contract) {
  let sessionId;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "GameStarted") {
        sessionId = ethers.toNumber(parsedLog.args[1]);
      }
    } catch (error) {
      console.log("Could not parse log:", log);
    }
  }
  return sessionId;
}

export async function GET(request: Request) {
  try {
    const gameData = await initializeGame();
    return Response.json({ status: 200, gameData });
  } catch (error: any) {
    return Response.json({ status: 500, error: error.message });
  }
}

export async function POST(request: Request) {
  const { prevPuzzleInfo, gameSessionId } = await request.json();
  try {
    const gameData = await generateNewPuzzle(prevPuzzleInfo, gameSessionId);
    return Response.json({ status: 200, gameData });
  } catch (error: any) {
    return Response.json({ status: 500, error: error.message });
  }
}
