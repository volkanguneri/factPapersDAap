const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("VOTING", async function () {
  let voting, owner, voter1, voter2;

  async function initilizeBlockchain() {
    [owner, voter1, voter2] = await ethers.getSigners();
    const contract = await hre.ethers.getContractFactory("Voting");
    voting = await contract.deploy(owner);

    return { owner, voter1, voter2, voting };
  }

  beforeEach(async function () {
    ({ owner, voter1, voter2, voting } = await loadFixture(
      initilizeBlockchain
    ));
  });

  it("Verify the owner of the contract", async function () {
    const _owner = await voting.owner();
    assert.equal(owner.address, _owner, "The owner addresses don't match");
  });
});
