const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

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

  describe("REGISTERING VOTERS", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
        initializeBlockchain
      ));
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
  });

  describe("PROPOSALS", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
        initializeBlockchain
      ));
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
    });

    it("Proposal registration session should be open to add proposals", async function () {
      const proposal = 5;
      await expect(voting.registerProposal(proposal)).to.be.revertedWith(
        "Proposal registration session is not open"
      );
    });

    it("If NOT voter, should NOT get proposals", async function () {
      await voting.startProposalRegister();
      const proposal = 5;
      await expect(
        voting.connect(voter1).registerProposal(proposal)
      ).to.be.revertedWith("You're not a voter");
    });

    it("Proposal can not be 0", async function () {
      await voting.startProposalRegister();
      const proposal = 0;
      await expect(voting.registerProposal(proposal)).to.be.revertedWith(
        "Proposal should not be 0"
      );
    });

    it("SHOULD be genesis proposal", async function () {
      await voting.startProposalRegister();
      const [num, voteCount] = await voting.getProposals(0);
      expect(num).to.equal(1234567890);
    });

    it("Owner who registered himself as a voter should add proposals", async function () {
      await voting.startProposalRegister();
      const proposal = 5;
      await voting.registerProposal(proposal);
      const [num, voteCount] = await voting.getProposals(1);
      expect(num).to.equal(proposal);
    });

    it("Should NOT make more than one proposal", async function () {
      await voting.startProposalRegister();
      const proposal01 = 1;
      const proposal02 = 2;
      await voting.registerProposal(proposal01);
      await expect(voting.registerProposal(proposal02)).to.be.revertedWith(
        "You've already made a proposal"
      );
    });

    it("SHOULD emit proposal registered event", async function () {
      await voting.startProposalRegister();
      const proposal = 5;
      await expect(voting.registerProposal(proposal))
        .to.emit(voting, "ProposalRegistered")
        .withArgs(1);
    });
  });

  describe("VOTE FUNCTION", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting } = await loadFixture(
        initializeBlockchain
      ));
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter1.address);
      await voting.startProposalRegister();
    });

    it("Should NOT vote if voting session have not started yet", async function () {
      // 0 is the index of 'GENESIS' proposal;
      await expect(voting.vote(0)).to.be.revertedWith(
        "Voting session havent started yet"
      );
    });

    it("Should NOT vote if not registered as voter", async function () {
      // 0 is the index of 'GENESIS' proposal;
      await expect(voting.connect(voter2).vote(0)).to.be.revertedWith(
        "You're not a voter"
      );
    });

    it("Should NOT vote more than once", async function () {
      await voting.startVotingSession();
      await voting.vote(0);
      await expect(voting.vote(0)).to.be.revertedWith("You have already voted");
    });

    it("Should emit Voted event", async function () {
      const proposal = 1;
      await voting.registerProposal(proposal);
      await voting.startVotingSession();
      await expect(voting.vote(1))
        .to.emit(voting, "Voted")
        .withArgs(owner.address, 1);
    });
  });

  describe("TALLY VOTES", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting } = await loadFixture(
        initializeBlockchain
      ));
      await voting.startRegisteringVoters();
      await voting.voterRegisters(owner.address);
      await voting.voterRegisters(voter1.address);
      await voting.voterRegisters(voter2.address);
      await voting.startProposalRegister();
      const anyProposal_01 = 1;
      const anyProposal_02 = 2;
      const anyProposal_03 = 3;
      await voting.registerProposal(anyProposal_01);
      await voting.connect(voter1).registerProposal(anyProposal_02);
      await voting.connect(voter2).registerProposal(anyProposal_03);
    });

    it("Voting session should be open", async function () {
      await expect(voting.tallyVote()).to.be.revertedWith(
        "Voting session should be open"
      );
    });

    it("Should not tally votes if not owner", async function () {
      await voting.startVotingSession();
      await expect(
        voting.connect(voter1).tallyVote()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("Should change workflow status to VotesTallied", async function () {
      await voting.startVotingSession();
      await voting.vote(1);
      await voting.connect(voter1).vote(2);
      await voting.connect(voter2).vote(2);
      await expect(voting.tallyVote())
        .to.emit(voting, "WorkflowStatusChange")
        .withArgs(3, 4);
    });
  });
});

describe("VOTING MANAGEMENT", async function () {
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

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
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

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
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

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
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

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
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

  // :::::::::::::::::::::::::::::START VOTING::::::::::::::::::::

  describe("START VOTING FUNCTIONS", async function () {
    beforeEach(async function () {
      ({ owner, voter1, voter2, voting, author, verifier } = await loadFixture(
        initializeBlockchain
      ));
      await voting.connect(owner).createAuthor(author.address);
      await voting.connect(owner).createVerifier(verifier.address);
      await voting.connect(author).changeTotalReportNumber();
      await voting.connect(author).changeTotalVerificationNumber();
      await voting.connect(author).changeTimeIntervalForVerifierPromotion();
      await voting.connect(author).changeTimeIntervalForAuthorPromotion();
    });

    // ::::::::::::::::::::::::::::startVotingForReportNumber::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await voting.connect(verifier).changeTotalReportNumber();
      await expect(
        voting.connect(voter1).startVotingForReportNumber()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
    });

    it("Owner SHOULD start voting", async function () {
      await voting.connect(verifier).changeTotalReportNumber();
      await voting.startVotingForReportNumber();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enouph", async function () {
      await expect(
        voting.connect(owner).startVotingForReportNumber()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author et verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enouph", async function () {
      await voting.connect(verifier).changeTotalReportNumber();
      await voting.startVotingForReportNumber();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::::::startVotingForVerificationNumber::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await voting.connect(verifier).changeTotalVerificationNumber();
      await expect(
        voting.connect(voter1).startVotingForVerificationNumber()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
    });

    it("Owner SHOULD start voting", async function () {
      await voting.connect(verifier).changeTotalVerificationNumber();
      await voting.startVotingForVerificationNumber();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        voting.connect(owner).startVotingForVerificationNumber()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await voting.connect(verifier).changeTotalVerificationNumber();
      await voting.startVotingForVerificationNumber();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::startVotingForVerifierPromotionInterval::::::::::::::::::::

    it("If not owner SHOULD NOT start voting", async function () {
      await voting.connect(verifier).changeTimeIntervalForVerifierPromotion();
      await expect(
        voting.connect(voter1).startVotingForVerifierPromotionInterval()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
    });

    it("Owner SHOULD start voting", async function () {
      await voting.connect(verifier).changeTimeIntervalForVerifierPromotion();
      await voting.startVotingForVerifierPromotionInterval();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        voting.connect(owner).startVotingForVerifierPromotionInterval()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await voting.connect(verifier).changeTimeIntervalForVerifierPromotion();
      await voting.startVotingForVerifierPromotionInterval();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    // ::::::::::::::::::::::::startVotingForAuthorPromotionInterval::::::::::::::::::::
    it("If not owner SHOULD NOT start voting", async function () {
      await voting.connect(verifier).changeTimeIntervalForAuthorPromotion();
      await expect(
        voting.connect(voter1).startVotingForAuthorPromotionInterval()
      ).to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT be triggered if workflow is not neutral", async function () {
      await voting.startRegisteringVoters();
      await expect(
        voting.connect(author).changeTotalReportNumber()
      ).to.be.revertedWith("There is already a voting going on");
    });

    it("Owner SHOULD start voting", async function () {
      await voting.connect(verifier).changeTimeIntervalForAuthorPromotion();
      await voting.startVotingForAuthorPromotionInterval();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });

    it("SHOULD NOT start voting if request number NOT enough", async function () {
      await expect(
        voting.connect(owner).startVotingForAuthorPromotionInterval()
      ).to.be.revertedWith(
        "The request number should be more than the half of the total of author and verifier numbers"
      );
    });

    it("SHOULD start voting if request number's enough", async function () {
      await voting.connect(verifier).changeTimeIntervalForAuthorPromotion();
      await voting.startVotingForAuthorPromotionInterval();
      const workflowStatus = await voting.workflowStatus();
      expect(await workflowStatus).to.equal(1);
    });
  });
});
