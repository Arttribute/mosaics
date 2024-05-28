// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IOracle {
    function createLlmCall(uint promptId) external returns (uint);
}

contract MosaicsGameAgent {
    struct Message {
        string role;
        string content;
    }

    struct GameSession {
        address player;
        Message[] messages;
        uint messageCount;
    }

    address private gameMaster;
    address public oracleAddress;

    constructor(address initialOracleAddress) {
        gameMaster = msg.sender;
        oracleAddress = initialOracleAddress;
    }

    modifier onlyGameMaster() {
        require(msg.sender == gameMaster, "Caller is not the game master");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not the oracle");
        _;
    }

    event OracleAddressUpdated(address indexed newOracleAddress);

    function setOracleAddress(address newOracleAddress) public onlyGameMaster {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    event GameStarted(address indexed player, uint indexed sessionId);
    mapping(uint => GameSession) public gameSessions;
    uint private gameSessionCount;

    function startGame(string memory initialMessage) public returns (uint) {
        GameSession storage session = gameSessions[gameSessionCount];

        session.player = msg.sender;
        Message memory newMessage;
        newMessage.content = initialMessage;
        newMessage.role = "user";
        session.messages.push(newMessage);
        session.messageCount = 1;

        uint currentId = gameSessionCount;
        gameSessionCount = gameSessionCount + 1;

        IOracle(oracleAddress).createLlmCall(currentId);
        emit GameStarted(msg.sender, currentId);

        return currentId;
    }

    function addMessage(string memory message, uint sessionId) public {
        GameSession storage session = gameSessions[sessionId];
        require(
            keccak256(abi.encodePacked(session.messages[session.messageCount - 1].role)) == keccak256(abi.encodePacked("assistant")),
            "No response to previous message"
        );
        require(
            session.player == msg.sender, "Only session player can add messages"
        );

        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        session.messages.push(newMessage);
        session.messageCount++;
        IOracle(oracleAddress).createLlmCall(sessionId);
    }

    function getMessageHistoryContents(uint sessionId) public view returns (string[] memory) {
        string[] memory contents = new string[](gameSessions[sessionId].messages.length);
        for (uint i = 0; i < gameSessions[sessionId].messages.length; i++) {
            contents[i] = gameSessions[sessionId].messages[i].content;
        }
        return contents;
    }

    function getMessageHistoryRoles(uint sessionId) public view returns (string[] memory) {
        string[] memory roles = new string[](gameSessions[sessionId].messages.length);
        for (uint i = 0; i < gameSessions[sessionId].messages.length; i++) {
            roles[i] = gameSessions[sessionId].messages[i].role;
        }
        return roles;
    }

    function onOracleLlmResponse(
        uint sessionId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        GameSession storage session = gameSessions[sessionId];
        require(
            keccak256(abi.encodePacked(session.messages[session.messageCount - 1].role)) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );

        Message memory newMessage;
        newMessage.content = response;
        newMessage.role = "assistant";
        session.messages.push(newMessage);
        session.messageCount++;
    }
}
