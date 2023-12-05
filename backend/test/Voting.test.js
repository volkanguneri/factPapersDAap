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
