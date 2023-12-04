const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const sinon = require("sinon");

describe("VOTING", async function () {
  let voting, owner, voter1, voter2, author, verifier;

  let authors = [];
  let verifiers = [];

  async function initializeBlockchain() {
    [owner, voter1, voter2, author, verifier] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("Voting");
    voting = await contract.deploy(owner);

    return { owner, voter1, voter2, voting, author, verifier };
  }

  beforeEach(async function () {
    ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
      initializeBlockchain
    ));
  });

  it("Verify the owner of the contract", async function () {
    const _owner = await voting.owner();
    expect(_owner).to.equal(owner.address, "The owner addresses don't match");
  });

  describe("ASK TO CHANGE VARIABLES", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
        initializeBlockchain
      ));
      await voting.connect(owner).createAuthor(author.address);
      await voting.connect(owner).createVerifier(verifier.address);
    });

    it("If not Author or Verifier SHOULD NOT trigger changeTotalReportNumber function", async function () {
      await expect(
        voting.connect(voter1).changeTotalReportNumber()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberRN = await voting.requestNumberRN();
      expect(initialrequestNumberRN).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await voting.connect(author).changeTotalReportNumber();
      const result = await voting.requestNumberRN();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await voting.connect(author).changeTotalReportNumber();
      await voting.connect(verifier).changeTotalReportNumber();
      const result = await voting.requestNumberRN();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await voting.connect(author).changeTotalReportNumber();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith(
        "You've already asked for a new min report number for promotion"
      );
    });

    //::::::::::::::::::::::::::::::::::::::::changeTotalVerificationNumber::::::::::::::::::::::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTotalVerificationNumber function", async function () {
      await expect(
        voting.connect(voter1).changeTotalVerificationNumber()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberVN = await voting.requestNumberVN();
      expect(initialrequestNumberVN).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await voting.connect(author).changeTotalVerificationNumber();
      const result = await voting.requestNumberVN();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await voting.connect(author).changeTotalVerificationNumber();
      await voting.connect(verifier).changeTotalVerificationNumber();
      const result = await voting.requestNumberVN();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await voting.connect(author).changeTotalVerificationNumber();
      await expect(
        voting.connect(author).changeTotalVerificationNumber()
      ).to.be.revertedWith(
        "You've already asked for a new min verification number for promotion"
      );
    });

    // :::::::::::::::::::::::::::::::::::::::::::changeTimeIntervalForVerifierPromotion::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTimeIntervalForVerifierPromotion function", async function () {
      await expect(
        voting.connect(voter1).changeTimeIntervalForVerifierPromotion()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberIV = await voting.requestNumberIV();
      expect(initialrequestNumberIV).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await voting.connect(author).changeTimeIntervalForVerifierPromotion();
      const result = await voting.requestNumberIV();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await voting.connect(author).changeTimeIntervalForVerifierPromotion();
      await voting.connect(verifier).changeTimeIntervalForVerifierPromotion();
      const result = await voting.requestNumberIV();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await voting.connect(author).changeTimeIntervalForVerifierPromotion();
      await expect(
        voting.connect(author).changeTimeIntervalForVerifierPromotion()
      ).to.be.revertedWith(
        "You've already asked for a new time interval for verifier promotion"
      );
    });
    //:::::::::::::::::::::::::::::::changeTimeIntervalForAuthorPromotion:::::::::::::::::::::::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTimeIntervalForAuthorPromotion function", async function () {
      await expect(
        voting.connect(voter1).changeTimeIntervalForAuthorPromotion()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberIA = await voting.requestNumberIA();
      expect(initialrequestNumberIA).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await voting.connect(author).changeTimeIntervalForAuthorPromotion();
      const result = await voting.requestNumberIA();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await voting.connect(author).changeTimeIntervalForAuthorPromotion();
      await voting.connect(verifier).changeTimeIntervalForAuthorPromotion();
      const result = await voting.requestNumberIA();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await voting.connect(author).changeTimeIntervalForAuthorPromotion();
      await expect(
        voting.connect(author).changeTimeIntervalForAuthorPromotion()
      ).to.be.revertedWith(
        "You've already asked for a new time interval for author promotion"
      );
    });
  });

  describe("START VOTING AND REGISTERING VOTERS", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
        initializeBlockchain
      ));
    });

    it("Only owner SHOULD start voting", async function () {
      await expect(
        voting.connect(voter1).startVoting()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("SHOULD start voting", async function () {
      await voting.startVoting();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("if NOT owner, should NOT add voters", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(voter1).voterRegisters(voter1.address)
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("Owner should add himself as a voter", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);

      const voterInfo_Owner = await voting.getVoter(owner.address);
      expect(voterInfo_Owner.isRegistered).to.equal(true);
    });

    it("Owner should add voter1", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter1.address);
      const voterInfo_voter1 = await voting.getVoter(voter1.address);
      expect(voterInfo_voter1.isRegistered).to.equal(true);
    });

    it("Owner should add voter2", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter2.address);
      const voterInfo_voter2 = await voting.getVoter(voter2.address);
      expect(voterInfo_voter2.isRegistered).to.equal(true);
    });

    it("Owner should NOT register himself more than once", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await expect(voting.voterRegisters(owner.address)).to.be.revertedWith(
        "Voter already added"
      );
    });

    it("Owner should NOT register voter1 more than once", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter1.address);
      await expect(voting.voterRegisters(voter1.address)).to.be.revertedWith(
        "Voter already added"
      );
    });

    it("Owner should NOT register voter2 more than once", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter2.address);
      await expect(voting.voterRegisters(voter2.address)).to.be.revertedWith(
        "Voter already added"
      );
    });

    it("SHOULD increment numberOfVoters", async function () {
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      expect(await voting.numberOfVoters()).to.equal(1);
    });

    it("SHOULD emit voterRegistered event", async function () {
      await voting.startRegisteringVoters();
      await expect(voting.voterRegisters(voter1.address))
        .to.emit(voting, "VoterRegistered")
        .withArgs(voter1.address);
    });

    describe("PROPOSALS", async function () {
      beforeEach(async function () {
        ({ owner, voter1, voter2, voting, author, verifier } =
          await loadFixture(initializeBlockchain));
      });

      it("SHOULD emit voterRegistered event", async function () {
        await voting.startRegisteringVoters();
        await expect(voting.voterRegisters(voter1.address))
          .to.emit(voting, "VoterRegistered")
          .withArgs(voter1.address);
      });
    });
  });
});
