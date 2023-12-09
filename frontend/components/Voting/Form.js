"use client";

import AddVoter from "@/components/Voting/AddVoter";
import AddProposal from "@/components/Voting/AddProposal";
import Result from "@/components/Voting/Result";
import SetVote from "@/components/Voting/SetVote";
import GetterVoter from "@/components/Voting/GetterVoter";
import GetterProposal from "@/components/Voting/GetterProposal";

// Styled Components
import { StyledForm } from "@/components/Voting/Styles/Form.styled";

const Form = () => {
  return (
    <StyledForm>
      <AddVoter />
      <GetterVoter />
      <AddProposal />
      <GetterProposal />
      <SetVote />
      <Result />
    </StyledForm>
  );
};

export default Form;
