"use client";

// React
import { useState } from "react";

// Wagmi
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { Voting_Abi, contractAddress_Voting } from "@/constants/index";

// Styled Components
import { StyledWorkflow, Button, State } from "./Workflow.styled";

const Workflow = () => {
  const [workflowStatus, setWorkflowStatus] = useState("Voters Registering");

  const startProposalsRegistering = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startProposalsRegistering",
      });

      const { hash } = await writeContract(request);
      alert("Contract written");

      // Mettez à jour l'état
      setWorkflowStatus("Proposals Registration Started");
    } catch (err) {
      alert(err.message);
    }
  };
  const endProposalsRegistering = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "endProposalsRegistering",
      });

      const { hash } = await writeContract(request);
      alert("Contract written");

      setWorkflowStatus("Proposals Registration Ended");
    } catch (err) {
      alert(err.message);
    }
  };

  const startVotingSession = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "startVotingSession",
      });

      const { hash } = await writeContract(request);
      alert("Contract written");

      setWorkflowStatus("Voting Session Started");
    } catch (err) {
      alert(err.message);
    }
  };

  const endVotingSession = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "endVotingSession",
      });

      const { hash } = await writeContract(request);

      setWorkflowStatus("Voting Session Ended");
    } catch (err) {
      alert(err.message);
    }
  };

  const tallyVote = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: abi,
        functionName: "tallyVotes",
      });

      const { hash } = await writeContract(request);

      setWorkflowStatus("Votes Tallied");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <StyledWorkflow>
        <Button type="button">Registering Voters</Button>
        <Button type="button" onClick={startProposalsRegistering}>
          Proposals Registration Started
        </Button>
        <Button type="button" onClick={startVotingSession}>
          Voting Session Started
        </Button>
        <Button type="button" onClick={tallyVote}>
          Votes Tallied
        </Button>
      </StyledWorkflow>

      <State>{workflowStatus}</State>
    </>
  );
};

export default Workflow;
