"use client";

// ReactJs
import { useState } from "react";

// Toastify
import { ToastContainer, toast } from "react-toastify";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

// Viem
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "viem/chains";

// Contract's information
import { Voting_Abi, contractAddress_Voting } from "../../constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const AddProposal = () => {
  const [value, setValue] = useState("");
  const [proposalAddedEvents, setProposalAddedEvents] = useState([]);

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  const addProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "registerProposal",
        args: [value],
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
      getProposalAddedEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getProposalAddedEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event ProposalRegistered(uint proposalId)"),
        fromBlock: 0n,
        toBlock: "latest",
      });
      setProposalAddedEvents(logs.map((log) => log.args.proposalId));
      toast.success("Proposal Added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Label>
      <H2>Add Proposal</H2>
      <Flex>
        <Input
          placeholder="Enter a value bigger than 0"
          value={value}
          type="number"
          onChange={(e) => setValue(e.target.value)}
        ></Input>
        <Button type="button" onClick={addProposal}>
          Submit
        </Button>
      </Flex>
    </Label>
  );
};

export default AddProposal;
