"use client";

import Whitelist from "@/components/Voting/Whitelist";
import Proposals from "@/components/Voting/Proposals";
import Result from "@/components/Voting/Result";
import Vote from "@/components/Voting/Vote";
import GetterVoter from "@/components/Voting/GetterVoter";
import GetterProposal from "@/components/Voting/GetterProposal";

// Styled Components
import { StyledForm } from "@/components/Voting/Styles/Form.styled";

const Form = () => {
  return (
    <StyledForm>
      <Whitelist />
      <GetterVoter />
      <Proposals />
      <GetterProposal />
      <Vote />
      <Result />
    </StyledForm>
  );
};

export default Form;
