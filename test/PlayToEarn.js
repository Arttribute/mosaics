const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlayToEarn", function () {
  let PlayToEarn, playToEarn, owner, addr1, addr2;

  beforeEach(async function () {
    PlayToEarn = await ethers.getContractFactory("PlayToEarn");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    playToEarn = await PlayToEarn.deploy();
  });

  describe("Staking", function () {
    it("Should allow a player to stake", async function () {
      await expect(
        playToEarn.connect(addr1).stake({ value: ethers.parseEther("1.0") })
      )
        .to.emit(playToEarn, "Staked")
        .withArgs(addr1.address, ethers.parseEther("1.0"));

      const player = await playToEarn.players(addr1.address);
      expect(player.stakedAmount).to.equal(ethers.parseEther("1.0"));
      expect(player.hasStaked).to.equal(true);
    });

    it("Should not allow staking with zero amount", async function () {
      await expect(
        playToEarn.connect(addr1).stake({ value: 0 })
      ).to.be.revertedWith("Must send some ETH to stake");
    });
  });

  describe("Completing Game", function () {
    beforeEach(async function () {
      await playToEarn
        .connect(addr1)
        .stake({ value: ethers.parseEther("1.0") });
    });

    it("Should allow a player to complete a game and win", async function () {
      const multiplier = 80;
      await expect(playToEarn.connect(addr1).completeGame(true, multiplier))
        .to.emit(playToEarn, "GameCompleted")
        .withArgs(addr1.address, true, multiplier, ethers.parseEther("0.8"));

      const player = await playToEarn.players(addr1.address);
      expect(player.stakedAmount).to.equal(0);
      expect(player.hasStaked).to.equal(false);
    });

    it("Should allow a player to complete a game and lose", async function () {
      await expect(playToEarn.connect(addr1).completeGame(false, 0))
        .to.emit(playToEarn, "GameCompleted")
        .withArgs(addr1.address, false, 0, ethers.parseEther("0.2"));

      const player = await playToEarn.players(addr1.address);
      expect(player.stakedAmount).to.equal(0);
      expect(player.hasStaked).to.equal(false);
    });

    it("Should not allow completing a game without staking", async function () {
      await expect(
        playToEarn.connect(addr2).completeGame(true, 2)
      ).to.be.revertedWith("No stake found");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await playToEarn
        .connect(addr1)
        .stake({ value: ethers.parseEther("1.0") });
    });

    it("Should allow a player to withdraw their stake", async function () {
      await expect(playToEarn.connect(addr1).withdraw())
        .to.emit(playToEarn, "Withdrawal")
        .withArgs(addr1.address, ethers.parseEther("1.0"));

      const player = await playToEarn.players(addr1.address);
      expect(player.stakedAmount).to.equal(0);
      expect(player.hasStaked).to.equal(false);
    });

    it("Should not allow withdrawal if no stake is found", async function () {
      await expect(playToEarn.connect(addr2).withdraw()).to.be.revertedWith(
        "No stake found"
      );
    });
  });
});
