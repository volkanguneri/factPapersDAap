"use client";

// React
import { useState } from "react";

// UseContext
import { useResultContext } from "../UseContext/ResultContext";

// React-Toast
import { toast } from "react-toastify";

// Wagmi
import {
  readContract,
  writeContract,
  prepareWriteContract,
  waitForTransaction,
} from "@wagmi/core";

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

  const [votingId, setVotingId] = useState("");

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
      toast.error(err.message);
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
      toast.error(err.message);
    }
  };

  const getVotingId = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "votingId",
      });

      setVotingId(data.toString());
    } catch (err) {
      toast.error(err.message);
    }
  };

  const writeWinningProposalNumToContract = async () => {
    await getVotingId();

    switch (votingId) {
      case "0":
        break;
      case "1":
        try {
          console.log("first one");
          const { request } = await prepareWriteContract({
            address: contractAddress_Voting,
            abi: Voting_Abi,
            functionName: "setVrequiredReportsForVerifierPromotion",
            args: [winningProposal.num],
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash: hash,
          });
          toast.success("Minimum Report Number For Verifier Promotion Changed");
        } catch (err) {
          toast.error(err.message);
        }
        break;
      case "2":
        try {
          const { request } = await prepareWriteContract({
            address: contractAddress_Voting,
            abi: Voting_Abi,
            functionName: "setVrequiredVerificationsForAuthorPromotion",
            args: [winningProposal.num],
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash: hash,
          });
          toast.success(
            "Minimum Verification Number For Author Promotion Changed"
          );
        } catch (err) {
          toast.error(err.message);
        }
        break;
      case "3":
        try {
          const { request } = await prepareWriteContract({
            address: contractAddress_Voting,
            abi: Voting_Abi,
            functionName: "setVtimeIntervalForVerifierPromotion",
            args: [winningProposal.num],
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash: hash,
          });
          toast.success("Minimum Period For Verifier Promotion Changed");
        } catch (err) {
          toast.error(err.message);
        }
        break;
      case "4":
        try {
          const { request } = await prepareWriteContract({
            address: contractAddress_Voting,
            abi: Voting_Abi,
            functionName: "setVtimeIntervalForAuthorPromotion",
            args: [winningProposal.num],
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash: hash,
          });
          toast.success("Minimum Period For Author Promotion Changed");
        } catch (err) {
          toast.error(err.message);
        }
        break;
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
          <ResultButton
            type="button"
            onClick={writeWinningProposalNumToContract}
          >
            Execute Result
          </ResultButton>
        </>
      )}
    </Label>
  );
};

export default Result;
