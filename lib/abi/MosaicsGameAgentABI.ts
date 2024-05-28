export const MosaicsGameAgentABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOracleAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "GameStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "OracleAddressUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "addMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "gameSessions",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "messageCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "getMessageHistoryContents",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "getMessageHistoryRoles",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "response",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "onOracleLlmResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oracleAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "setOracleAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "initialMessage",
        type: "string",
      },
    ],
    name: "startGame",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
