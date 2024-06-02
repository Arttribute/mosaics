const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MosaicsNFTReward", function () {
  let MosaicsNFTReward, mosaicsNFTReward, owner, addr1, addr2;

  beforeEach(async function () {
    MosaicsNFTReward = await ethers.getContractFactory("MosaicsNFTReward");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    mosaicsNFTReward = await MosaicsNFTReward.deploy();
  });

  describe("Minting", function () {
    it("Should mint a single token and assign it to the recipient", async function () {
      const tokenUri = "https://example.com/metadata/1";
      const tx = await mosaicsNFTReward.mint(addr1.address, tokenUri);
      await tx.wait();

      expect(await mosaicsNFTReward.ownerOf(0)).to.equal(addr1.address);
      expect(await mosaicsNFTReward.tokenURI(0)).to.equal(tokenUri);
    });

    it("Should mint a batch of tokens and assign them to the recipients", async function () {
      const recipients = [addr1.address, addr2.address];
      const tokenUris = [
        "https://example.com/metadata/1",
        "https://example.com/metadata/2",
      ];
      const tx = await mosaicsNFTReward.mintBatch(recipients, tokenUris);
      await tx.wait();

      expect(await mosaicsNFTReward.ownerOf(0)).to.equal(addr1.address);
      expect(await mosaicsNFTReward.tokenURI(0)).to.equal(tokenUris[0]);

      expect(await mosaicsNFTReward.ownerOf(1)).to.equal(addr2.address);
      expect(await mosaicsNFTReward.tokenURI(1)).to.equal(tokenUris[1]);
    });

    it("Should revert if recipients array is empty", async function () {
      const recipients = [];
      const tokenUris = [];
      await expect(
        mosaicsNFTReward.mintBatch(recipients, tokenUris)
      ).to.be.revertedWith("Recipients array is empty");
    });

    it("Should revert if recipients and tokenUris arrays length mismatch", async function () {
      const recipients = [addr1.address];
      const tokenUris = [
        "https://example.com/metadata/1",
        "https://example.com/metadata/2",
      ];
      await expect(
        mosaicsNFTReward.mintBatch(recipients, tokenUris)
      ).to.be.revertedWith("Recipients and tokenUris arrays length mismatch");
    });
  });
});
