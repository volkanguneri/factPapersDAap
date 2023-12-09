DAO Governance System
A decentralized governance system built on the Ethereum blockchain for managing promotions and key parameters using smart contracts.

Table of Contents
Introduction
Technology Stack
Smart Contracts
Dao.sol
Voting.sol
Getting Started
Local Development
Testnet Deployment
Usage
Contributing
License
Introduction
Decentralized Autonomous Organizations (DAOs) are at the forefront of decentralized governance. This DAO governance system allows a community to manage promotion rules dynamically through voting. Key parameters, such as required reports for verifier promotion and verification numbers for author promotion, can be modified via a transparent voting process.

Technology Stack
Smart Contracts: Solidity
Web Frontend: Next.js, Wagmi, Viem, RainbowKit, Styled-Components
Testing & Deployment: Hardhat, OpenZeppelin
Environment Management: Dotenv
Smart Contracts
Dao.sol
The Dao contract represents the DAO structure with roles for authors, verifiers, and readers. Owners can manage whitelisted members, create, and ban authors or verifiers. This contract also includes rules for promotions that can be modified by the community through voting.

Voting.sol
The Voting contract extends the functionality of the Dao contract, adding a voting system for proposals and workflow management. It allows the owner to initiate voting sessions, register voters, propose changes, and tally votes. The contract handles various states such as registering voters, proposing changes, and conducting voting sessions.

Getting Started
Local Development

1. Clone the repository:
   git clone <https://github.com/volkanguneri/factPapersDAap.git>

2. Install dependencies:
   cd <frontend>
   npm install

   cd <backend>
   yarn install

3. Create a .env file and set environment variables:
   INFURA_URL=<your_infura_url>
   PRIVATE_KEY=<your_private_key>

4. Compile and deploy smart contracts locally:
   yarn hardhat compile
   yarn hardhat node
   yarn hardhat run scripts/deploy.js --network localhost

5. Start the web application:
   npx next dev

6. Open your browser and visit http://localhost:3000.

Testnet Deployment
For testnet deployment, replace the .env variables with your testnet details and run the deployment script:

yarn hardhat run scripts/deploy.js --network sepolia

Usage
Access the web application at http://localhost:3000 (for local development).

Connect your wallet and participate in the voting sessions.

Vote on proposals to modify parameters like required reports and verification numbers.

Contributing
Feel free to contribute by opening issues, providing feedback, or submitting pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.
