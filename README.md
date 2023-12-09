## **FactPapers: Decentralized Fact-Checking Jornalisme Application**

## **Table of Contents:**

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Smart Contracts](#smart-contracts)
   - [Dao.sol](#daosol)
   - [Voting.sol](#votingsol)
4. [Getting Started](#getting-started)
   - [Local Development](#local-development)
   - [Testnet Deployment](#testnet-deployment)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## **Introduction**

FactPapers is a decentralized journalism application with self-governance facilitated through a Decentralized Autonomous Organization (DAO). The current focus of the DAO is on the final project, and implementation is underway.

## **Technology Stack**

- **Smart Contracts:** Solidity
- **Web Frontend:** Next.js, Wagmi, Viem, RainbowKit, Styled-Components
- **Testing & Deployment:** Hardhat, OpenZeppelin
- **Environment Management:** Dotenv

## **Smart Contracts**

### **Dao.sol**

The Dao contract represents the DAO structure with roles for authors, verifiers, and readers. Owners can manage whitelisted members, create, and ban authors or verifiers. This contract also includes rules for promotions that can be modified by the community through voting.

### **Voting.sol**

The Voting contract extends the functionality of the Dao contract, adding a voting system for proposals and workflow management. It allows the owner to initiate voting sessions, register voters, propose changes, and tally votes. The contract handles various states such as registering voters, proposing changes, and conducting voting sessions.

## **Getting Started**

### **Local Development**

1. Clone the repository:

   ```bash
   git clone https://github.com/volkanguneri/factPapersDAap.git

   ```

2. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

   ```bash
   cd backend
   yarn install
   ```

3. Create a .env file and set environment variables:

   ```bash
   INFURA_URL=<your_infura_url>
   PRIVATE_KEY=<your_private_key>
   ```

4. Compile, test, and deploy smart contracts locally:

   ```bash
   yarn hardhat compile
   ```

   ```bash
   yarn hardhat coverage
   ```

   ```bash
   yarn hardhat node
   ```

   ```bash
   yarn hardhat run scripts/deploy.js --network localhost
   ```

5. Start the web application:

   ```bash
   npx next dev
   ```

6. Open your browser and visit http://localhost:3000.

   Testnet Deployment

   For testnet deployment, replace the .env variables with your testnet details and run the deployment script:

   ```bash
   yarn hardhat run scripts/deploy.js --network sepolia
   ```

## **Usage**

Connect your wallet and participate in the voting sessions.

Vote on proposals to modify parameters like required reports and verification numbers.

## **Developper**

Volkan Guneri

## **Contributing**

Feel free to contribute by opening issues, providing feedback, or submitting pull requests.

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.
