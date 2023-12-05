const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VOTING MANAGEMENT", async function () {
  let votingManagement, owner, voter1, voter2, author, verifier;

  let authors = [];
  let verifiers = [];

  async function initializeBlockchain() {
    [owner, voter1, voter2, author, verifier] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("VotingManagement");
    votingManagement = await contract.deploy(owner);

    return { owner, voter1, voter2, votingManagement, author, verifier };
  }

  beforeEach(async function () {
    ({ owner, voter1, voter2, votingManagement, author, verifier } =
      await loadFixture(initializeBlockchain));
  });

  describe("ASK TO CHANGE VARIABLES", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, votingManagement, author, verifier } =
        await loadFixture(initializeBlockchain));
      await votingManagement.connect(owner).createAuthor(author.address);
      await votingManagement.connect(owner).createVerifier(verifier.address);
    });

    it("If not Author or Verifier SHOULD NOT trigger changeTotalReportNumber function", async function () {
      await expect(
        votingManagement.connect(voter1).changeTotalReportNumber()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberRN = await votingManagement.requestNumberRN();
      expect(initialrequestNumberRN).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await votingManagement.connect(author).changeTotalReportNumber();
      const result = await votingManagement.requestNumberRN();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await votingManagement.connect(author).changeTotalReportNumber();
      await votingManagement.connect(verifier).changeTotalReportNumber();
      const result = await votingManagement.requestNumberRN();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await votingManagement.connect(author).changeTotalReportNumber();
      await expect(
        votingManagement.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith(
        "You've already asked for a new min report number for promotion"
      );
    });

    //::::::::::::::::::::::::::::::::::::::::changeTotalVerificationNumber::::::::::::::::::::::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTotalVerificationNumber function", async function () {
      await expect(
        votingManagement.connect(voter1).changeTotalVerificationNumber()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberVN = await votingManagement.requestNumberVN();
      expect(initialrequestNumberVN).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await votingManagement.connect(author).changeTotalVerificationNumber();
      const result = await votingManagement.requestNumberVN();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await votingManagement.connect(author).changeTotalVerificationNumber();
      await votingManagement.connect(verifier).changeTotalVerificationNumber();
      const result = await votingManagement.requestNumberVN();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await votingManagement.connect(author).changeTotalVerificationNumber();
      await expect(
        votingManagement.connect(author).changeTotalVerificationNumber()
      ).to.be.revertedWith(
        "You've already asked for a new min verification number for promotion"
      );
    });

    // :::::::::::::::::::::::::::::::::::::::::::changeTimeIntervalForVerifierPromotion::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTimeIntervalForVerifierPromotion function", async function () {
      await expect(
        votingManagement
          .connect(voter1)
          .changeTimeIntervalForVerifierPromotion()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberIV = await votingManagement.requestNumberIV();
      expect(initialrequestNumberIV).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForVerifierPromotion();
      const result = await votingManagement.requestNumberIV();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForVerifierPromotion();
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForVerifierPromotion();
      const result = await votingManagement.requestNumberIV();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForVerifierPromotion();
      await expect(
        votingManagement
          .connect(author)
          .changeTimeIntervalForVerifierPromotion()
      ).to.be.revertedWith(
        "You've already asked for a new time interval for verifier promotion"
      );
    });
    //:::::::::::::::::::::::::::::::changeTimeIntervalForAuthorPromotion:::::::::::::::::::::::::::::::::::::::::::::::::::::

    it("If not Author or Verifier SHOULD NOT trigger changeTimeIntervalForAuthorPromotion function", async function () {
      await expect(
        votingManagement.connect(voter1).changeTimeIntervalForAuthorPromotion()
      ).to.be.revertedWith("Only authors or verifiers can access!");
    });

    it("Initial request number should be 0", async function () {
      const initialrequestNumberIA = await votingManagement.requestNumberIA();
      expect(initialrequestNumberIA).to.equal(0);
    });

    it("Author SHOULD trigger changeTotalReportNumber function to increment request number", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForAuthorPromotion();
      const result = await votingManagement.requestNumberIA();
      expect(result).to.equal(1);
    });

    it("Request number SHOULD be two if triggered twice", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForAuthorPromotion();
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForAuthorPromotion();
      const result = await votingManagement.requestNumberIA();
      expect(result).to.equal(2);
    });

    it("Request number SHOULD NOT be triggered twice by the same address", async function () {
      await votingManagement
        .connect(author)
        .changeTimeIntervalForAuthorPromotion();
      await expect(
        votingManagement.connect(author).changeTimeIntervalForAuthorPromotion()
      ).to.be.revertedWith(
        "You've already asked for a new time interval for author promotion"
      );
    });
  });

  // :::::::::::::::::::::::::::::START VOTING::::::::::::::::::::

  describe("START VOTING FUNCTIONS", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, votingManagement, author, verifier } =
        await loadFixture(initializeBlockchain));
      await votingManagement.connect(owner).createAuthor(author.address);
      await votingManagement.connect(owner).createVerifier(verifier.address);
      await votingManagement.connect(author).changeTotalReportNumber();
      await votingManagement.connect(author).changeTotalVerificationNumber();
      await votingManagement
        .connect(author)
        .changeTimeIntervalForVerifierPromotion();
      await votingManagement
        .connect(author)
        .changeTimeIntervalForAuthorPromotion();
    });

    // ::::::::::::::::::::::::::::startVotingForReportNumber::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await votingManagement.connect(verifier).changeTotalReportNumber();
      await expect(
        votingManagement.connect(voter1).startVotingForReportNumber()
      ).to.be.revertedWithCustomError(
        votingManagement,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Owner SHOULD start voting", async function () {
      await votingManagement.connect(verifier).changeTotalReportNumber();
      await votingManagement.startVotingForReportNumber();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enouph", async function () {
      await expect(
        votingManagement.connect(owner).startVotingForReportNumber()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author et verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enouph", async function () {
      await votingManagement.connect(verifier).changeTotalReportNumber();
      await votingManagement.startVotingForReportNumber();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::::::startVotingForVerificationNumber::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await votingManagement.connect(verifier).changeTotalVerificationNumber();
      await expect(
        votingManagement.connect(voter1).startVotingForVerificationNumber()
      ).to.be.revertedWithCustomError(
        votingManagement,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Owner SHOULD start voting", async function () {
      await votingManagement.connect(verifier).changeTotalVerificationNumber();
      await votingManagement.startVotingForVerificationNumber();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        votingManagement.connect(owner).startVotingForVerificationNumber()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await votingManagement.connect(verifier).changeTotalVerificationNumber();
      await votingManagement.startVotingForVerificationNumber();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::startVotingForVerifierPromotionInterval::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForVerifierPromotion();
      await expect(
        votingManagement
          .connect(voter1)
          .startVotingForVerifierPromotionInterval()
      ).to.be.revertedWithCustomError(
        votingManagement,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Owner SHOULD start voting", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForVerifierPromotion();
      await votingManagement.startVotingForVerifierPromotionInterval();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        votingManagement
          .connect(owner)
          .startVotingForVerifierPromotionInterval()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForVerifierPromotion();
      await votingManagement.startVotingForVerifierPromotionInterval();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::startVotingForAuthorPromotionInterval::::::::::::::::::::
    it("If not owner SHOULD NOT start voting", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForAuthorPromotion();
      await expect(
        votingManagement.connect(voter1).startVotingForAuthorPromotionInterval()
      ).to.be.revertedWithCustomError(
        votingManagement,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Owner SHOULD start voting", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForAuthorPromotion();
      await votingManagement.startVotingForAuthorPromotionInterval();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        votingManagement.connect(owner).startVotingForAuthorPromotionInterval()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForAuthorPromotion();
      await votingManagement.startVotingForAuthorPromotionInterval();
      const workflowStatus = await votingManagement.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD add a new Voting contract to votings array when owner starts voting", async function () {
      await votingManagement
        .connect(verifier)
        .changeTimeIntervalForVerifierPromotion();

      const initialVotingsLength = await votingManagement.votings.length;

      await votingManagement.startVotingForVerifierPromotionInterval();

      const updatedVotingsLength = await votingManagement.votings.length;

      expect(updatedVotingsLength).to.equal(initialVotingsLength + 1);

      //   Optionally, you can check more details about the new Voting contract if needed
      //   const newVotingAddress = await votingManagement.votings(
      //     updatedVotingsLength - 1
      //   );
      //   const newVoting = await ethers.getContractAt("Voting", newVotingAddress);
      //   console.log(newVoting);
    });
  });
});
