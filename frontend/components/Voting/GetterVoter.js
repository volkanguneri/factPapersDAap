"use client";

// ReactJs
import { useState } from "react";

// Wagmi
import { readContract } from "@wagmi/core";

// import { useAccount } from "wagmi";

// Contract's information
import { Voting_Abi, contractAddress } from "../../constants/index";

// React Styled Components
import { Flex } from "./Styles/Flex.styled";
import { H2 } from "./Styles/H2.styled";
import { Input } from "./Styles/Input.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";
import { StyledInfoDiv } from "./Styles/InfoDiv.styled";

const GetterVoter = () => {
  const [voter, setVoter] = useState("");
  const [contractData, setContractData] = useState("");

  const getVoter = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Voting_Abi,
        functionName: "getVoter",
        args: [voter],
      });
      setContractData(data); // Update state with contract data
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Label>
      <H2>Get Voter</H2>
      <Flex>
        <Input
          placeholder="Enter the voter address"
          value={voter}
          onChange={(e) => setVoter(e.target.value)}
        ></Input>
        <Button type="button" onClick={getVoter}>
          Submit
        </Button>
      </Flex>

      {contractData && (
        <StyledInfoDiv>
          <ul>
            <H2>Voter Information </H2>
            <li>
              {contractData.hasVoted ? (
                <strong>This voter has already voted</strong>
              ) : (
                <strong>This voter has not voted yet</strong>
              )}
            </li>
            <li>
              {contractData.isRegistered ? (
                <strong>This voter is already registered</strong>
              ) : (
                <strong>This voter is not registered yet</strong>
              )}
            </li>

            {contractData.hasVoted ? (
              <li>
                <strong>
                  The voter's voted proposal id is{" "}
                  {contractData.votedProposalId}
                </strong>
              </li>
            ) : null}
          </ul>
        </StyledInfoDiv>
      )}
    </Label>
  );
};

export default GetterVoter;
