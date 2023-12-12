"use client";

// ReactJs
import { useEffect, useState } from "react";

// Toastify
import { toast } from "react-toastify";

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
import { Voting_Abi, contractAddress_Voting } from "@/constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const AddVoter = () => {
  // Voter Information
  const [voter, setVoter] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [voterRegisteredEvents, setVoterRegisteredEvents] = useState([]);

  // Toast

  // Event handling function
  const getVoterRegisteredEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event VoterRegistered(address voterAddress)"),
        fromBlock: 0n,
        toBlock: "latest",
      });
      setVoterRegisteredEvents(logs.map((log) => log.args.voterAddress));
      toast.success("Voter Added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fonction to add a voter

  const addVoter = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "voterRegisters",
        args: [voter],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getVoterRegisteredEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

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
    </Label>
  );
};

export default AddVoter;
