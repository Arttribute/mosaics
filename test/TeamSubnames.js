const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TeamSubnames Contract", function () {
  let TeamSubnames;
  let teamSubnames;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    TeamSubnames = await ethers.getContractFactory("TeamSubnames");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    teamSubnames = await TeamSubnames.deploy();
  });

  describe("Create Team", function () {
    it("Should create a team", async function () {
      await teamSubnames.createTeam("teamA");
      const team = await teamSubnames.getTeam("teamA");
      expect(team[0]).to.equal("teamA");
      expect(team[1]).to.equal(owner.address);
      expect(team[2].length).to.equal(0);
    });

    it("Should not allow duplicate team names", async function () {
      await teamSubnames.createTeam("teamA");
      await expect(teamSubnames.createTeam("teamA")).to.be.revertedWith(
        "Team already exists"
      );
    });
  });

  describe("Add Member", function () {
    it("Should add a member to a team", async function () {
      await teamSubnames.createTeam("teamA");
      await teamSubnames.addMember("teamA", addr1.address);
      const team = await teamSubnames.getTeam("teamA");
      expect(team[2].length).to.equal(1);
      expect(team[2][0]).to.equal(addr1.address);
    });

    it("Should not add a member if not the creator", async function () {
      await teamSubnames.createTeam("teamA");
      await expect(
        teamSubnames.connect(addr1).addMember("teamA", addr2.address)
      ).to.be.revertedWith("Only creator can add members");
    });

    it("Should not add a member to a non-existent team", async function () {
      await expect(
        teamSubnames.addMember("teamB", addr1.address)
      ).to.be.revertedWith("Team does not exist");
    });
  });

  describe("Remove Member", function () {
    it("Should remove a member from a team", async function () {
      await teamSubnames.createTeam("teamA");
      await teamSubnames.addMember("teamA", addr1.address);
      await teamSubnames.removeMember("teamA", addr1.address);
      const team = await teamSubnames.getTeam("teamA");
      expect(team[2].length).to.equal(0);
    });

    it("Should not remove a member if not the creator", async function () {
      await teamSubnames.createTeam("teamA");
      await teamSubnames.addMember("teamA", addr1.address);
      await expect(
        teamSubnames.connect(addr1).removeMember("teamA", addr1.address)
      ).to.be.revertedWith("Only creator can remove members");
    });

    it("Should not remove a member from a non-existent team", async function () {
      await expect(
        teamSubnames.removeMember("teamB", addr1.address)
      ).to.be.revertedWith("Team does not exist");
    });

    it("Should revert if member not found", async function () {
      await teamSubnames.createTeam("teamA");
      await expect(
        teamSubnames.removeMember("teamA", addr1.address)
      ).to.be.revertedWith("Member not found");
    });
  });

  describe("Get Team", function () {
    it("Should return the correct team details", async function () {
      await teamSubnames.createTeam("teamA");
      const team = await teamSubnames.getTeam("teamA");
      expect(team[0]).to.equal("teamA");
      expect(team[1]).to.equal(owner.address);
    });

    it("Should revert for non-existent team", async function () {
      await expect(teamSubnames.getTeam("teamB")).to.be.revertedWith(
        "Team does not exist"
      );
    });
  });
});
