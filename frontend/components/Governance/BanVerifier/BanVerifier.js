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

const BanVerifier = () => {
  // Voter Information
  const [bannedVerifier, setBannedVerifier] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [bannedVerifierEvents, setBannedVerifierEvents] = useState([]);

  // Event handling function
  const getBannedVerifierEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event VerifierBanned(address _verifier)"),
        fromBlock: 0n,
        toBlock: "latest",
      });

      // Mise à jour du state avec les événements VoterRegistered
      setBannedVerifierEvents(logs.map((log) => log.args.bannedVerifier));
    } catch (err) {
      alert(err.message);
    }
  };

  const banVerifier = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "banVerifier",
        args: [bannedVerifier],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      console.log(data);

      getBannedVerifierEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  // Utilisation de useEffect pour s'abonner aux événements lors du montage initial
  useEffect(() => {
    getBannedVerifierEvents();
  }, []);

  return (
    <Label>
      <H2>Ban Verifier</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={bannedVerifier}
          onChange={(e) => setBannedVerifier(e.target.value)}
        />
        <Button type="button" onClick={banVerifier}>
          Submit
        </Button>
      </Flex>

      {bannedVerifierEvents ? (
        <div>
          <ul>
            {bannedVerifierEvents &&
              bannedVerifierEvents.map((address, index) => (
                <li key={index}>
                  <span>Banned Verifier Address : </span>
                  {address}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </Label>
  );
};

export default BanVerifier;
