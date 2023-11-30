"use client";

// ReactJs
import { useState } from "react";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
// import { useAccount } from "wagmi";

// Contract's information
import { abi, contractAddress } from "@/constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const Vote = () => {
  const [proposalId, setProposalId] = useState("");

  const setVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "setVote",
        args: [proposalId],
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
      alert("Contract written");
    } catch (err) {
      alert(err.message);
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
export default Vote;
