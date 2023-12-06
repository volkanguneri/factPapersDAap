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
  const voting = await Voting.deploy("");

  console.log("Voting deployed to:", voting.target);

  // VOTINGMANAGEMENT DEPLOYMENT

  const VotingManagement = await ethers.getContractFactory("VotingManagement");
  const votingManagement = await VotingManagement.deploy();

  console.log("Voting Management deployed to:", votingManagement.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
