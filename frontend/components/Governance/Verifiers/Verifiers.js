"use client";

// ReactJs
import { useEffect, useState } from "react";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
// import { useAccount } from "wagmi";

// Viem
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "viem/chains";

// Contract's information
import { Voting_Abi, Dao_Abi, contractAddress_Voting } from "@/constants/index";

import { Flex } from "../../Voting/Styles/Flex.styled";
import { H2 } from "../../Voting/Styles/H2.styled";
import { Input } from "../../Voting/Styles/Input.styled";
import { Button } from "../../Voting/Styles/Button.styled";
import { Label } from "../../Voting/Styles/Label.styled";

const Verifiers = () => {
  // Voter Information
  const [verifier, setVerifier] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [verifierRegisteredEvents, setverifierRegisteredEvents] = useState([]);

  // Event handling function
  const getVerifierRegisteredEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem(
          "event VerifierCreated(address indexed verifier, uint256 date)"
        ),
        fromBlock: 0n,
        toBlock: "latest",
      });

      // Mise à jour du state avec les événements VoterRegistered
      setverifierRegisteredEvents(logs.map((log) => log.args.verifier));
    } catch (err) {
      alert(err.message);
    }
  };

  // Fonction pour ajouter un électeur
  const createverifier = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "createVerifier",
        args: [verifier],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      console.log(data);

      getVerifierRegisteredEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  // Utilisation de useEffect pour s'abonner aux événements lors du montage initial
  useEffect(() => {
    getVerifierRegisteredEvents();
  }, []);

  return (
    <Label>
      <H2>Add verifier</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={verifier}
          onChange={(e) => setVerifier(e.target.value)}
        />
        <Button type="button" onClick={createverifier}>
          Submit
        </Button>
      </Flex>

      {verifierRegisteredEvents ? (
        <div>
          <ul>
            {verifierRegisteredEvents &&
              verifierRegisteredEvents.map((address, index) => (
                <li key={index}>
                  <span>Added verifier Address : </span>
                  {address}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </Label>
  );
};

export default Verifiers;
