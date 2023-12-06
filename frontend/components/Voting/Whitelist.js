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
import { Voting_Abi, contractAddress } from "@/constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const Whitelist = () => {
  // Voter Information
  const [voter, setVoter] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [voterRegisteredEvents, setVoterRegisteredEvents] = useState([]);

  // Event handling function
  const getVoterRegisteredEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress,
        event: parseAbiItem("event VoterRegistered(address voterAddress)"),
        fromBlock: 0n,
        toBlock: "latest",
      });

      // Mise à jour du state avec les événements VoterRegistered
      setVoterRegisteredEvents(logs.map((log) => log.args.voterAddress));
    } catch (err) {
      alert(err.message);
    }
  };

  // Fonction pour ajouter un électeur
  const addVoter = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Voting_Abi,
        functionName: "addVoter",
        args: [voter],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getVoterRegisteredEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  // Utilisation de useEffect pour s'abonner aux événements lors du montage initial
  useEffect(() => {
    getVoterRegisteredEvents();
  }, []);

  return (
    <Label>
      <H2>Add Voter</H2>
      <Flex>
        <Input
          placeholder="Enter a voter address"
          value={voter}
          onChange={(e) => setVoter(e.target.value)}
        />
        <Button type="button" onClick={addVoter}>
          Submit
        </Button>
      </Flex>

      {voterRegisteredEvents ? (
        <div>
          <ul>
            {voterRegisteredEvents &&
              voterRegisteredEvents.map((address, index) => (
                <li key={index}>
                  <span>Added Voter Address : </span>
                  {address}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </Label>
  );
};

export default Whitelist;
