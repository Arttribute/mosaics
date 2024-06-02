// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PlayToEarn {
    uint public constant lossPercentage = 80;

    struct Player {
        uint stakedAmount;
        bool hasStaked;
    }

    mapping(address => Player) public players;

    event Staked(address indexed player, uint amount);
    event GameCompleted(address indexed player, bool won, uint multiplier, uint reward);
    event Withdrawal(address indexed player, uint amount);

    constructor() {}

    function stake() external payable {
        require(msg.value > 0, "Must send some ETH to stake");
        players[msg.sender] = Player(msg.value, true);
        emit Staked(msg.sender, msg.value);
    }

    function completeGame(bool won, uint multiplier) external {
        require(players[msg.sender].hasStaked, "No stake found");

        Player storage player = players[msg.sender];
        uint reward;

        if (won) {
            reward = player.stakedAmount * (multiplier)/ 100;
            payable(msg.sender).transfer(reward);
        } else {
            reward = player.stakedAmount * (100 - lossPercentage) / 100;
            payable(msg.sender).transfer(reward);
        }

        player.hasStaked = false;
        player.stakedAmount = 0;

        emit GameCompleted(msg.sender, won, multiplier, reward);
    }

    function withdraw() external {
        require(players[msg.sender].hasStaked, "No stake found");

        Player storage player = players[msg.sender];
        uint amount = player.stakedAmount;

        player.hasStaked = false;
        player.stakedAmount = 0;

        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}
