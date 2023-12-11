const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DAO", async function () {
  let dao, owner, author, verifier, registeredReader;

  async function initializeBlockchain() {
    [owner, author, verifier, registeredReader] = await ethers.getSigners();
    const contract = await hre.ethers.getContractFactory("Dao");
    dao = await contract.deploy(owner);

    return { owner, author, verifier, registeredReader };
  }

  beforeEach(async function () {
    ({ owner, author, verifier, registeredReader } = await loadFixture(
      initializeBlockchain
    ));
  });

  it("Verify the owner of the contract", async function () {
    const _owner = await dao.owner();
    assert.equal(owner.address, _owner, "The owner addresses don't match");
  });

  describe("CHANGEBALE VARIABLES INITIAL VALUES", async function () {
    beforeEach(async function () {
      ({ owner, author, verifier, registeredReader } = await loadFixture(
        initializeBlockchain
      ));
    });

    it("should set initial value for requiredReports", async function () {
      const requiredReports = await dao.VrequiredReportsForVerifierPromotion();
      expect(requiredReports).to.equal(10);
    });

    it("should set initial value for requiredVerifications", async function () {
      const requiredVerifications =
        await dao.VrequiredVerificationsForAuthorPromotion();
      expect(requiredVerifications).to.equal(20);
    });

    it("should set initial value for verifierPromotionInterval", async function () {
      const verifierPromotionInterval =
        await dao.VtimeIntervalForVerifierPromotion();
      expect(verifierPromotionInterval).to.equal(6 * 30 * 24 * 60 * 60); // 6 months in seconds
    });

    it("SHOULD set initial value for authorPromotionInterval", async function () {
      const authorPromotionInterval =
        await dao.VtimeIntervalForAuthorPromotion();
      expect(authorPromotionInterval).to.equal(12 * 30 * 24 * 60 * 60); // 12 months in seconds
    });
  });

  describe("AUTHOR AND VERIFIER CREATION AND BAN", async function () {
    beforeEach(async function () {
      ({ owner, author, verifier, registeredReader } = await loadFixture(
        initializeBlockchain
      ));
    });

    // Authors

    it("Only owner SHOULD create authors", async function () {
      await expect(
        dao.connect(author).createAuthor(author.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT create authors if already exist", async function () {
      await dao.createAuthor(author.address);
      await expect(dao.createAuthor(author.address)).to.be.revertedWith(
        "Author already exists"
      );
    });

    it("Author SHOULD be created", async function () {
      await dao.createAuthor(author.address);
      expect(await dao.numberOfAuthors()).to.equal(1);
    });

    it("SHOULD emit AuthorCreated event", async function () {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timestampTolerance = 100;
      await expect(dao.createAuthor(author.address))
        .to.emit(dao, "AuthorCreated")
        .withArgs(author.address, (actualTimestamp) => {
          console.log("current time stamp: ", currentTimestamp);
          console.log("actual time stamp: ", actualTimestamp);
          return (
            actualTimestamp >= currentTimestamp - timestampTolerance &&
            actualTimestamp <= currentTimestamp + timestampTolerance
          );
        });
    });

    // Verifiers

    it("Only owner SHOULD create authors", async function () {
      await expect(
        dao.connect(author).createAuthor(author.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("SHOULD NOT create verifiers if already exist", async function () {
      await dao.createVerifier(verifier.address);
      await expect(dao.createVerifier(verifier.address)).to.be.revertedWith(
        "Verifier already exists"
      );
    });

    it("Verifier SHOULD be created", async function () {
      await dao.createVerifier(verifier.address);
      expect(await dao.numberOfVerifiers()).to.equal(1);
    });

    it("SHOULD emit VerifierCreated event", async function () {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timestampTolerance = 100;
      await expect(dao.createVerifier(verifier.address))
        .to.emit(dao, "VerifierCreated")
        .withArgs(verifier.address, (actualTimestamp) => {
          console.log("current: ", currentTimestamp);
          console.log("actual: ", actualTimestamp);
          return (
            actualTimestamp >= currentTimestamp - timestampTolerance &&
            actualTimestamp <= currentTimestamp + timestampTolerance
          );
        });
    });

    // to ban author

    it("Only owner SHOULD ban authors", async function () {
      await dao.createAuthor(author.address);
      await expect(
        dao.connect(verifier).banAuthor(author.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("Author SHOULD exist to be banned", async function () {
      await expect(dao.banAuthor(author.address)).to.be.revertedWith(
        "Author not found"
      );
    });

    it("Only owner SHOULD ban authors", async function () {
      await dao.createAuthor(author.address);
      await expect(
        dao.connect(registeredReader).banAuthor(author.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("Author SHOULD be banned", async function () {
      await dao.createAuthor(author.address);
      await dao.banAuthor(author.address);
      expect(await dao.numberOfAuthors()).to.equal(0);
    });

    it("SHOULD emit AuthorBanned event", async function () {
      await dao.createAuthor(author.address);
      await expect(dao.banAuthor(author.address))
        .to.emit(dao, "AuthorBanned")
        .withArgs(author.address);
    });

    // to ban verifier

    it("Only owner SHOULD ban verifiers", async function () {
      await dao.createVerifier(verifier.address);
      await expect(
        dao.connect(author).banAuthor(verifier.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("Only owner SHOULD ban verifiers", async function () {
      await dao.createVerifier(verifier.address);
      await expect(
        dao.connect(registeredReader).banAuthor(verifier.address)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("Verifier SHOULD exist to be banned", async function () {
      await expect(dao.banVerifier(verifier.address)).to.be.revertedWith(
        "Verifier not found"
      );
    });

    it("Verifier SOULD be banned", async function () {
      await dao.createVerifier(verifier.address);
      await dao.banVerifier(verifier.address);
      expect(await dao.numberOfVerifiers()).to.equal(0);
    });

    it("SHOULD emit VerifierBanned event", async function () {
      await dao.createVerifier(verifier.address);
      await expect(dao.banVerifier(verifier.address))
        .to.emit(dao, "VerifierBanned")
        .withArgs(verifier.address);
    });
  });

  describe("DAO RULE SETTERS", async function () {
    beforeEach(async function () {
      ({ owner, author, verifier, registeredReader } = await loadFixture(
        initializeBlockchain
      ));
    });

    it("SHOULD change required report number if owner", async function () {
      await dao.setVrequiredReportsForVerifierPromotion(5);
      expect(await dao.VrequiredReportsForVerifierPromotion()).to.equal(5);
    });

    it("SHOULD not change required report number if owner", async function () {
      await expect(
        dao.connect(author).setVrequiredReportsForVerifierPromotion(5)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("SHOULD change required verifications for author promotion if owner", async function () {
      await dao.setVrequiredVerificationsForAuthorPromotion(15);
      expect(await dao.VrequiredVerificationsForAuthorPromotion()).to.equal(15);
    });

    it("SHOULD not change required verifications for author promotion if not owner", async function () {
      await expect(
        dao.connect(author).setVrequiredVerificationsForAuthorPromotion(15)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("SHOULD change time interval for verifier promotion if owner", async function () {
      await dao.setVtimeIntervalForVerifierPromotion(7 * 24 * 60 * 60);
      expect(await dao.VtimeIntervalForVerifierPromotion()).to.equal(
        7 * 24 * 60 * 60
      );
    });

    it("SHOULD not change time interval for verifier promotion if not owner", async function () {
      await expect(
        dao
          .connect(author)
          .setVtimeIntervalForVerifierPromotion(7 * 24 * 60 * 60)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });

    it("SHOULD change time interval for author promotion if owner", async function () {
      await dao.setVtimeIntervalForAuthorPromotion(15 * 24 * 60 * 60); // 15 jours en secondes
      expect(await dao.VtimeIntervalForAuthorPromotion()).to.equal(
        15 * 24 * 60 * 60
      );
    });

    it("SHOULD not change time interval for author promotion if not owner", async function () {
      await expect(
        dao
          .connect(author)
          .setVtimeIntervalForAuthorPromotion(15 * 24 * 60 * 60)
      ).to.be.revertedWithCustomError(dao, "OwnableUnauthorizedAccount");
    });
  });
});
