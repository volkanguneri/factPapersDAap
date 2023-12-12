const { ethers } = require("hardhat");

async function main() {
  // DAO DEPLOYMENT

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Dao = await ethers.getContractFactory("Dao");
  const dao = await Dao.deploy();

  console.log("Dao deployed to:", dao.target);

  // VOTING DEPLOYMENT

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  console.log("Voting deployed to:", voting.target);

  const ownerAddress = deployer.address;

  try {
    const tx = await voting.createAuthor(ownerAddress);

    await tx.wait();

    console.log("Owner registered as an author in Voting contract");
  } catch (error) {
    console.error("Error registering owner as an author:", error);
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
