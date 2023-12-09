"use client";

// React
import { useEffect, useState } from "react";

// Wagmi
import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { Voting_Abi, contractAddress_Voting } from "@/constants/index";

// Styled Components
import { StyledWorkflow, Button, State } from "./Workflow.styled";

const Workflow = () => {
  const [workflowStatus, setWorkflowStatus] = useState("Voting is not open");

  const startRegisteringVoters = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startRegisteringVoters",
      });

      const { hash } = await writeContract(request);
    } catch (err) {
      alert(err.message);
    }
  };

  const startProposalRegister = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startProposalRegister",
      });

      const { hash } = await writeContract(request);
    } catch (err) {
      alert(err.message);
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
    } catch (err) {
      alert(err.message);
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
    } catch (err) {
      alert(err.message);
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
      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    readWorkflowStatus();

    const intervalId = setInterval(readWorkflowStatus, 5000); // Appel toutes les 5 secondes, ajustez selon vos besoins

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  return (
    <>
      <StyledWorkflow>
        <Button type="button" onClick={startRegisteringVoters}>
          Registering Voters
        </Button>
        <Button type="button" onClick={startProposalRegister}>
          Proposals Registration Started
        </Button>
        <Button type="button" onClick={startVotingSession}>
          Voting Session Started
        </Button>
        <Button type="button" onClick={tallyVote}>
          Votes Tallied
        </Button>
      </StyledWorkflow>

      <State>{renderWorkflowStatus()}</State>
    </>
  );
};

export default Workflow;
