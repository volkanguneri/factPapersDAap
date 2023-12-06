"use client";

// ReactJs
import { useState } from "react";

// Wagmi
import { readContract } from "@wagmi/core";

// import { useAccount } from "wagmi";

// Contract's information
import { Voting_Abi, contractAddress } from "@/constants/index";

// React Styled Components
import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";
import { StyledInfoDiv } from "./Styles/InfoDiv.styled";

// ... Importations nécessaires ...

const GetterProposal = () => {
  const [proposalId, setProposalId] = useState("");
  const [contractData, setContractData] = useState("");

  const getProposal = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Voting_Abi,
        functionName: "getProposals",
        args: [proposalId],
      });
      setContractData(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Label>
      <H2>Get Proposal</H2>
      <Flex>
        <Input
          placeholder="Enter a proposal ID"
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          style={{ appearance: "textfield" }}
        ></Input>
        <Button type="button" onClick={getProposal}>
          Submit
        </Button>
      </Flex>

      {contractData && (
        <StyledInfoDiv>
          <ul>
            <H2>Proposal Information </H2>
            <li>
              <strong>Description:</strong> {contractData.num}
            </li>
            <li>
              <strong>Vote Count:</strong> {contractData.voteCount.toString()}
            </li>
          </ul>
        </StyledInfoDiv>
      )}
    </Label>
  );
};

export default GetterProposal;
