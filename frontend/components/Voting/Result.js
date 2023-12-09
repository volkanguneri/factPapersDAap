"use client";

// React
import { useState } from "react";

// Wagmi
import { readContract } from "@wagmi/core";

// Importations nécessaires
import { Voting_Abi, contractAddress_Voting } from "../../constants/index";

// Styled Components
import { H2 } from "./Styles/H2.styled";
import { Button } from "./Styles/Button.styled";
import { Label } from "./Styles/Label.styled";
import { UlStyled } from "./Styles/Ul.styled";
import { ResultButton } from "./Styles/ResultButton.styled";

const Result = () => {
  const [winningProposalID, setWinningProposalID] = useState("");
  const [proposal, setProposal] = useState("");

  const displayResult = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "winningProposalId",
      });
      setWinningProposalID(data);
      getProposal(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const getProposal = async (proposalId) => {
    try {
      const proposalData = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "getProposals",
        args: [proposalId],
      });
      // const { num, voteCount } = data;

      setProposal(proposalData);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Label>
      <ResultButton type="button" onClick={displayResult}>
        Result
      </ResultButton>

      {winningProposalID && (
        <>
          {proposal ? (
            <UlStyled>
              <li>
                <strong>Value:</strong> {proposal.num.toString()}
              </li>
              <li>
                <strong>Vote Count:</strong> {proposal.voteCount.toString()}
              </li>
            </UlStyled>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </Label>
  );
};

export default Result;
