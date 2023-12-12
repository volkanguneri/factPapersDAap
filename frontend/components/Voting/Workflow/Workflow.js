"use client";

// React
import { useEffect, useState } from "react";

// Toastify
import { toast } from "react-toastify";

// Wagmi
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { Voting_Abi, contractAddress_Voting } from "@/constants/index";

// Styled Components
import { StyledWorkflow, Button, State, PStyled } from "./Workflow.styled";

const Workflow = () => {
  const [workflowStatus, setWorkflowStatus] = useState("Voting is not open");
  const [votingId, setVotingId] = useState();

  const startProposalRegister = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startProposalRegister",
      });
      const { hash } = await writeContract(request);
      readWorkflowStatus();
      toast.success("Proposal Registeration Started");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startVotingSession = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startVotingSession",
      });

      const { hash } = await writeContract(request);
      readWorkflowStatus();
      toast.success("Voting Session Started");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const tallyVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "tallyVote",
      });

      const { hash } = await writeContract(request);
      readWorkflowStatus();
      toast.success("Votes Tallied");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const readWorkflowStatus = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "workflowStatus",
      });
      setWorkflowStatus(data);
      readVotingId();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const readVotingId = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "votingId",
      });
      let dataToString = data.toString();
      setVotingId(dataToString);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    readWorkflowStatus();
    readVotingId();
  }, []);

  // useEffect(() => {
  //   readWorkflowStatus();
  //   readVotingId();

  //   const intervalId01 = setInterval(readWorkflowStatus, 5000);

  //   const intervalId02 = setInterval(readVotingId, 5000);

  //   return () => {
  //     clearInterval(intervalId01);
  //     clearInterval(intervalId02);
  //   };
  // }, []);

  const renderWorkflowStatus = () => {
    switch (workflowStatus) {
      case 0:
        return "No Voting Session Is Open Yet";
      case 1:
        return "Registering Voters";
      case 2:
        return "Proposals Registration Started";
      case 3:
        return "Voting Session is Open";
      case 4:
        return "Votes are Tallied";
      default:
        return "Unknown Workflow Status";
    }
  };

  const renderRuleToVoteFor = () => {
    switch (votingId) {
      case "0":
        return "No rule to vote for yet";
      case "1":
        return "Minimum Report Number for Verifier Promotion";
      case "2":
        return "Minimum Verification Number For Author Promotion ";
      case "3":
        return "Minimum Period For Verifier Promotion";
      case "4":
        return "Minimum Period For Verifier Promotion";
    }
  };

  return (
    <>
      <StyledWorkflow>
        <Button type="button" onClick={startProposalRegister}>
          Start Proposal Registration
        </Button>
        <Button type="button" onClick={startVotingSession}>
          Start Voting Session
        </Button>
        <Button type="button" onClick={tallyVote}>
          Tally Votes
        </Button>
      </StyledWorkflow>

      <State>{renderWorkflowStatus()}</State>
      <State>
        <PStyled>Voting For</PStyled>
        {renderRuleToVoteFor()}
      </State>
    </>
  );
};

export default Workflow;
