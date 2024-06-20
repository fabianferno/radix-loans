export const contract = {
  address: "0xEb905A3A74d144c898875093CB8ec1e1F53d8F97",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "question",
          type: "string",
        },
      ],
      name: "MarketCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum PredictionMarket.MarketOutcome",
          name: "outcome",
          type: "uint8",
        },
      ],
      name: "MarketResolved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "prediction",
          type: "bool",
        },
      ],
      name: "VotesBought",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "claimer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "WinningsClaimed",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_marketId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_prediction",
          type: "bool",
        },
        {
          internalType: "bytes",
          name: "_encryptedVote",
          type: "bytes",
        },
      ],
      name: "buyVotes",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_marketId",
          type: "uint256",
        },
      ],
      name: "claimWinnings",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_question",
          type: "string",
        },
        {
          internalType: "string",
          name: "_publicKey",
          type: "string",
        },
        {
          internalType: "string",
          name: "_sharedSecret",
          type: "string",
        },
      ],
      name: "createMarket",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "marketCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
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
          name: "",
          type: "uint256",
        },
      ],
      name: "markets",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "question",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "totalYesVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalNoVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalWinnings",
          type: "uint256",
        },
        {
          internalType: "enum PredictionMarket.MarketOutcome",
          name: "outcome",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
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
          internalType: "uint256",
          name: "_marketId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_outcome",
          type: "bool",
        },
      ],
      name: "resolveMarket",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
