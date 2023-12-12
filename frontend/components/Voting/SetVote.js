"use client";

// ReactJs
import { useState, useEffect } from "react";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

// Viem event handling
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
import { toast } from "react-toastify";

const SetVote = () => {
  const [proposalId, setProposalId] = useState("");
  const [votedEvents, setVotedEvents] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  const setVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "vote",
        args: [proposalId],
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
      getVotedEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Event handling function
  const getVotedEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event Voted(address voter, uint proposalId)"),
        fromBlock: 0n,
        toBlock: "latest",
      });

      setVotedEvents(logs.map((log) => log.args.proposalId));
      toast.success("Voted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Label>
      <H2>Vote</H2>
      <Flex>
        <Input
          placeholder="Enter a proposal ID"
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          style={{ appearance: "textfield" }}
        ></Input>
        <Button type="button" onClick={setVote}>
          Submit
        </Button>
      </Flex>
    </Label>
  );
};
export default SetVote;
