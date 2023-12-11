require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sepolia: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
