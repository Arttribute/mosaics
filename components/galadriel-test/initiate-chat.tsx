
"use client"
import React from 'react'
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {Contract, ethers, TransactionReceipt, Wallet} from "ethers";
import { chatGPTABI } from "@/lib/abi/chatGptABI";



require("dotenv").config()

const NEXT_PUBLIC_ORACLE_ADDRESS="0x4168668812C94a3167FCd41D12014c5498D74d7e"
const NEXT_PUBLIC_CHATGPT_CONTRACT_ADDRESS="0x6e282F3593511BB144c80299acAc51467FAB6BE3"


const NEXT_PUBLIC_RPC_URL="https://devnet.galadriel.com/"
const NEXT_PUBLIC_WALLET_PRIVATE_KEY="19daf05aeaceeac68736f22cffeb780f59a892c94eba0a5227f465429b086428"



const CreateChat = () => {
    const [chat, setchat] = useState<number |null>(null)
    const [response, setResponse] = useState<string>("")


    const contractAddress = NEXT_PUBLIC_CHATGPT_CONTRACT_ADDRESS

    //Instead of this you should connect it to a web3Modal instead of this hardcoded wallet address
    const privateKey = NEXT_PUBLIC_WALLET_PRIVATE_KEY
    console.log("Wallet PK:",privateKey)
    const rpcUrl = NEXT_PUBLIC_RPC_URL
    console.log("Provider: ", rpcUrl)

    
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    const wallet = new Wallet(
        privateKey, provider
      )
    console.log(wallet)
    
    // Function to retrieve chatId used to identify a chat or game instance
    function getChatId(receipt: TransactionReceipt, contract: Contract) {
        let chatId
        for (const log of receipt.logs) {
          try {
            const parsedLog = contract.interface.parseLog(log)
            if (parsedLog && parsedLog.name === "ChatCreated") {
              // Second event argument
              chatId = ethers.toNumber(parsedLog.args[1])
            }
          } catch (error) {
            // This log might not have been from your contract, or it might be an anonymous log
            console.log("Could not parse log:", log)
          }
        }
        return chatId;
      }
      

    const  handleClick = async () => {
        console.log("Clicked boi")
        const contract = new Contract(contractAddress, chatGPTABI, wallet)
        console.log("Contract:", contract)

        const message = "You are an assistant. I am currently building a game and will require your help. I am going to use an AI to generate images based on prompts you give me to make puzzles. The prompts could be vague or ultra specific. I'm thinking that the more complex image prompts should also be worded more vaguely. Prompts I send you from this point will be in the form {timeTaken: '15s', moves: 12} which corresponds to the user's performance in solving a puzzle from the image generated from the prompt you gave me. Based on the time a user takes to complete the puzzle, the number of moves a user make, you should adjust the time given to complete a puzzle, the level of difficulty of the puzzle and the difficulty of the prompt(easy, medium, hard). You can use the first 5 prompts to form a baseline for the user's performance. Also to ensure that the puzzles don't get too crazy, the absolute minimum maximum time you can give the user to solve the puzzle is 15 seconds. Make sure to adjust your parameters to ensure the user stay engaged. Also, make sure you format all your responses in this manner(even the first one): {prompt:'Prompt goes here', level: 'hard', timeGiven: 10}. You can generate the first prompt now";



        const transactionResponse = await contract.startChat(message)
        console.log(transactionResponse)
        const receipt = await transactionResponse.wait()
        console.log(`Message sent, tx hash: ${receipt.hash}`)
        console.log(`Chat started with message: "${message}"`)

  // Get the chat ID from transaction receipt logs
        let chatId = getChatId(receipt, contract);
        console.log(`Created chat ID: ${chatId}`)
        if (!chatId && chatId !== 0) {
            return
        }
        setchat(chatId)

        // This is the response from the openAI model
        const messages = await contract.getMessageHistoryContents(chatId)
        setResponse(messages[1])
        console.log("Response")
        console.log(messages[1])


        



    }
    if (chat != null) {
        console.log("Chat is set:", chat)       
    }


  return (
    <div>
        <Button variant="outline" onClick={handleClick}>Start Explore Mode</Button>
        {chat}
        {response ? response : "Empty"}
    </div>
  )
}

export default CreateChat