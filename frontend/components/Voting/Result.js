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

const Result = () => {
  const [winningProposalID, setWinningProposalID] = useState("");
  const [proposal, setProposal] = useState("");

  const displayResult = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "winningProposalID",
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
        address: contractAddress,
        abi: Voting_Abi,
        functionName: "getOneProposal",
        args: [proposalId],
      });

      setProposal(proposalData);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Label>
      <Button type="button" onClick={displayResult}>
        Result
      </Button>

      {winningProposalID && (
        <div>
          <H2>Result</H2>
          {proposal ? (
            <ul>
              <li>
                <strong>Description:</strong> {proposal.description.toString()}
              </li>
              <li>
                <strong>Vote Count:</strong> {proposal.voteCount.toString()}
              </li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </Label>
  );
};

export default Result;
