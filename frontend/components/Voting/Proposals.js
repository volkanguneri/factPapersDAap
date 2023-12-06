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
import { Voting_Abi, contractAddress } from "../../constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const Proposals = () => {
  const [description, setDescription] = useState("");

  const addProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Voting_Abi,
        functionName: "addProposal",
        args: [description],
      });
      const { hash } = await writeContract(request);
      alert("Contract written");
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Label>
      <H2>Add Proposal</H2>
      <Flex>
        <Input
          placeholder="Enter a proposal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></Input>
        <Button type="button" onClick={addProposal}>
          Submit
        </Button>
      </Flex>
    </Label>
  );
};

export default Proposals;
