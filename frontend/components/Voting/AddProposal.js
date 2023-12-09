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
import { Voting_Abi, contractAddress_Voting } from "../../constants/index";

import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";

const AddProposal = () => {
  const [value, setValue] = useState("");

  const addProposal = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "registerProposal",
        args: [value],
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
