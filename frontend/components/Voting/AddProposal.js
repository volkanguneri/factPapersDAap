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
// import { useAccount } from "wagmi";

// Contract's information
import { Voting_Abi, contractAddress_Voting } from "../../constants/index";

// Components
import Spinner from "../Spinner/Spinner";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const AddProposal = () => {
  const [value, setValue] = useState("");
  const [proposalAddedEvents, setProposalAddedEvents] = useState([]);

  // Toast
  const [loading, setLoading] = useState(false);

  const addProposal = async () => {
    setLoading(true);
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

      setVoterRegisteredEvents(logs.map((log) => log.args.proposalId));
      let lastEvent = await voterRegisteredEvents[
        voterRegisteredEvents.length - 1
      ];
      toast.success(`Added Proposal Id: ${lastEvent}`);
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
      <Spinner loading={loading} />
      <ToastContainer autoClose={3000} />
    </Label>
  );
};

export default AddProposal;
