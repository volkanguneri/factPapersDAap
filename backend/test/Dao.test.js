const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DAO", async function () {
  let dao, owner, author, verifier, registeredReader;

  async function initilizeBlockchain() {
    [owner, author, verifier, registeredReader] = await ethers.getSigners();
    const contract = await hre.ethers.getContractFactory("Dao");
    dao = await contract.deploy(owner);

    return { owner, author, verifier, registeredReader };
  }

  beforeEach(async function () {
    ({ owner, author, verifier, registeredReader } = await loadFixture(
      initilizeBlockchain
    ));
  });

  it("Verify the owner of the contract", async function () {
    const _owner = await dao.owner();
    assert.equal(owner.address, _owner, "The owner addresses don't match");
  });

  describe("CHANGEBALE VARIABLES INITIAL VALUES", async function () {
    beforeEach(async function () {
      ({ owner, author, verifier, registeredReader } = await loadFixture(
        initilizeBlockchain
      ));
    });

    it("should set initial values", async function () {
      const requiredReports = await dao.requiredReportsForVerifierPromotion();
      const requiredVerifications =
        await dao.requiredVerificationsForAuthorPromotion();
      const verifierPromotionInterval =
        await dao.timeIntervalForVerifierPromotion();
      const authorPromotionInterval =
        await dao.timeIntervalForAuthorPromotion();

      expect(requiredReports).to.equal(10);
      expect(requiredVerifications).to.equal(20);
      expect(verifierPromotionInterval).to.equal(6 * 30 * 24 * 60 * 60); // 6 months in seconds
      expect(authorPromotionInterval).to.equal(12 * 30 * 24 * 60 * 60); // 12 months in seconds
    });

    it("Only owner SHOULD create authors", async function () {
      await dao.connect(owner).createAuthor(author.address);
      await expect(dao.createAuthor(author.address)).to.be.revertedWith(
        "Author already exists"
      );
    });

    it("Only owner SHOULD create verifiers", async function () {
      await dao.connect(owner).createVerifier(verifier.address);
      await expect(dao.createVerifier(verifier.address)).to.be.revertedWith(
        "Verifier already exists"
      );
    });

    // function createAuthor(address author) external onlyOwner {
    //     require(!authors[msg.sender], "Author already exists");
    //     authors[author] = Author(true, 0);
    //     numberOfAuthors++;
    //     emit AuthorCreated(msg.sender, true, block.timestamp);
    // }
  });
});
