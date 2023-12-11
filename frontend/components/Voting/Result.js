"use client";

// React
import { useState } from "react";

// UseContext
import { useResultContext } from "../UseContext/ResultContext";

// Wagmi
import { readContract } from "@wagmi/core";

// Importations nécessaires
import { Voting_Abi, contractAddress_Voting } from "../../constants/index";

// Styled Components
import { Label } from "./Styles/Label.styled";
import { UlStyled } from "./Styles/Ul.styled";
import { ResultButton } from "./Styles/ResultButton.styled";

const Result = () => {
  const { setNum } = useResultContext();
  const [winningProposalID, setWinningProposalID] = useState("");
  const [winningProposal, setWinningProposal] = useState("");

  const displayResult = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "winningProposalId",
      });
      setWinningProposalID(data);
      getWinningProposal(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const getWinningProposal = async (proposalId) => {
    try {
      const proposalData = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "getProposals",
        args: [proposalId],
      });
      setWinningProposal(proposalData);
      setNum(proposalData.num.toString());
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
          {winningProposal ? (
            <UlStyled>
              <li>
                <strong>Value:</strong> {winningProposal.num.toString()}
              </li>
              <li>
                <strong>Vote Count:</strong>{" "}
                {winningProposal.voteCount.toString()}
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
