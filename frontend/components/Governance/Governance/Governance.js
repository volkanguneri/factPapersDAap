"use client";

// ReactJs
import { useState, useEffect } from "react";

// UseContext
import { useResultContext } from "../../UseContext/ResultContext";

import Authors from "../Authors/Authors";
import Verifiers from "../Verifiers/Verifiers";
import BanAuthor from "../BanAuthor/BanAuthor";
import BanVerifier from "../BanVerifier/BanVerifier";

import {
  StyledMain,
  StyledButton,
  H1Styled,
  H2Styled,
  UlStyled,
  LiStyled,
  PSTyled,
} from "./Governance.styled";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  readContract,
} from "@wagmi/core";
// import { useAccount } from "wagmi";

// Viem
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "viem/chains";
// Contract's information
import {
  Dao_Abi,
  Voting_Abi,
  contractAddress_Dao,
  contractAddress_Voting,
} from "@/constants/index";

const Governance = () => {
  const { winningProposalNum } = useResultContext();

  const [governanceData01, setGovernanceData01] = useState("");
  const [governanceData02, setGovernanceData02] = useState("");
  const [governanceData03, setGovernanceData03] = useState("");
  const [governanceData04, setGovernanceData04] = useState("");

  const [requestNumberDataRN, setRequestNumberDataRN] = useState("");
  const [requestNumberDataVN, setRequestNumberDataVN] = useState("");
  const [requestNumberDataIV, setRequestNumberDataIV] = useState("");
  const [requestNumberDataIA, setRequestNumberDataIA] = useState("");

  const [variableToChange, setVariableToChange] = useState("");

  // ::::::::::::::::::::::::::::::::: GET PROMOTION VALUES:::::::::::::::::::::::::::::::::::::::::::::::::::

  const getPromotionValues = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData01(data.toString());
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VrequiredVerificationsForAuthorPromotion",
      });
      setGovernanceData02(data);
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VtimeIntervalForVerifierPromotion",
      });
      const dataString = data.toString();
      const inMonths = dataString / 60 / 60 / 24 / 30;

      setGovernanceData03(inMonths);
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VtimeIntervalForAuthorPromotion",
      });

      const dataString = data.toString();
      const inMonths = dataString / 60 / 60 / 24 / 30;

      setGovernanceData04(inMonths);
    } catch (err) {
      alert(err.message);
    }
  };

  // :::::::::::::::::::::::::::::::::::CHANGE PROMOTION VALUES::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const changePromotionValues01 = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "changeTotalReportNumber",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberRN",
      });
      const dataString = data.toString();
      setRequestNumberDataRN(dataString);
    } catch (err) {
      alert(err.message);
    }
  };

  const changePromotionValues02 = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "changeTotalVerificationNumber",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberVN",
      });
      const dataString = data.toString();
      setRequestNumberDataVN(dataString);
    } catch (err) {
      alert(err.message);
    }
  };
  const changePromotionValues03 = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "changeTimeIntervalForVerifierPromotion",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberIV",
      });
      const dataString = data.toString();
      setRequestNumberDataIV(dataString);
    } catch (err) {
      alert(err.message);
    }
  };
  const changePromotionValues04 = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "changeTimeIntervalForAuthorPromotion",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberIA",
      });

      const dataString = data.toString();

      setRequestNumberDataIA(dataString);
    } catch (err) {
      alert(err.message);
    }
  };

  // :::::::::::::::::::::::::::::::::::::::READ REQUEST NUMBERS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const readRequestNumbers = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberRN",
      });
      const dataString = data.toString();
      setRequestNumberDataRN(dataString);
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberVN",
      });
      const dataString = data.toString();
      setRequestNumberDataVN(dataString);
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberIV",
      });
      const dataString = data.toString();
      setRequestNumberDataIV(dataString);
    } catch (err) {
      alert(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "requestNumberIA",
      });

      const dataString = data.toString();

      setRequestNumberDataIA(dataString);
    } catch (err) {
      alert(err.message);
    }
  };

  // ::::::::::::::::::::::::::::::::::::Start Voting Functions:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const startVotingForReportNumber = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startVotingForReportNumber",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    // try {
    //   const data = await readContract({
    //     address: contractAddress_Voting,
    //     abi: Voting_Abi,
    //     functionName: "variableToChange",
    //   });
    //   setVariableToChange(data);
    //   console.log(data);
    // } catch (err) {
    //   alert(err.message);
    // }
  };

  const startVotingForVerificationNumber = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startVotingForVerificationNumber",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    // try {
    //   const data = await readContract({
    //     address: contractAddress_Voting,
    //     abi: Voting_Abi,
    //     functionName: "requestNumberVN",
    //   });
    //   const dataString = data.toString();
    //   setRequestNumberDataVN(dataString);
    // } catch (err) {
    //   alert(err.message);
    // }
  };
  const startVotingForVerifierPromotionInterval = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startVotingForVerifierPromotionInterval",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    // try {
    //   const data = await readContract({
    //     address: contractAddress_Voting,
    //     abi: Voting_Abi,
    //     functionName: "requestNumberIV",
    //   });
    //   const dataString = data.toString();
    //   setRequestNumberDataIV(dataString);
    // } catch (err) {
    //   alert(err.message);
  };
  const startVotingForAuthorPromotionInterval = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "startVotingForAuthorPromotionInterval",
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
    } catch (err) {
      alert(err.message);
    }

    // try {
    //   const data = await readContract({
    //     address: contractAddress_Voting,
    //     abi: Voting_Abi,
    //     functionName: "requestNumberIA",
    //   });

    //   const dataString = data.toString();

    //   setRequestNumberDataIA(dataString);
    // } catch (err) {
    //   alert(err.message);
    // }
  };

  useEffect(() => {
    getPromotionValues();
    readRequestNumbers();
  }, [
    requestNumberDataRN,
    requestNumberDataVN,
    requestNumberDataIV,
    requestNumberDataIA,
  ]);

  useEffect(() => {
    console.log("Winning Proposal Num from Context:", winningProposalNum);
  }, [winningProposalNum]);

  useEffect(() => {
    setGovernanceData01(winningProposalNum);
    console.log(governanceData01);
    console.log(winningProposalNum);
  }, [winningProposalNum]);

  return (
    <>
      <StyledMain>
        <H2Styled>Promotion Rules</H2Styled>

        {governanceData01 &&
          governanceData02 &&
          governanceData03 &&
          governanceData04 && (
            <>
              <UlStyled>
                <LiStyled>
                  <PSTyled>
                    Minimum Report Number For Verifier Promotion: {""}
                  </PSTyled>
                  <strong>{governanceData01}</strong>
                  <StyledButton type="button" onClick={changePromotionValues01}>
                    Voting Request
                  </StyledButton>
                  <strong>{requestNumberDataRN}</strong>
                  <StyledButton
                    type="button"
                    onClick={startVotingForReportNumber}
                  >
                    Start Voting
                  </StyledButton>
                </LiStyled>

                <LiStyled>
                  <PSTyled>
                    Minimum Verification Number For Author Promotion:{" "}
                  </PSTyled>
                  <strong>{governanceData02.toString()}</strong>
                  <StyledButton type="button" onClick={changePromotionValues02}>
                    Voting Request
                  </StyledButton>
                  <strong>{requestNumberDataVN}</strong>
                  <StyledButton
                    type="button"
                    onClick={startVotingForVerificationNumber}
                  >
                    Start Voting
                  </StyledButton>
                </LiStyled>

                <LiStyled>
                  <PSTyled>
                    {" "}
                    Minimum Period For Verifier Promotion: {""}
                  </PSTyled>
                  <strong>
                    {governanceData03} {""} Mo
                  </strong>
                  <StyledButton type="button" onClick={changePromotionValues03}>
                    Voting Request
                  </StyledButton>
                  <strong>{requestNumberDataIV}</strong>
                  <StyledButton
                    type="button"
                    onClick={startVotingForVerifierPromotionInterval}
                  >
                    Start Voting
                  </StyledButton>
                </LiStyled>

                <LiStyled>
                  <PSTyled>Minimum Period For Author Promotion: {""}</PSTyled>
                  <strong>
                    {governanceData04} {""} Mo
                  </strong>
                  <StyledButton type="button" onClick={changePromotionValues04}>
                    Voting Request
                  </StyledButton>
                  <strong>{requestNumberDataIA}</strong>
                  <StyledButton
                    type="button"
                    onClick={startVotingForAuthorPromotionInterval}
                  >
                    Start Voting
                  </StyledButton>
                </LiStyled>
              </UlStyled>
            </>
          )}

        <Authors />
        <Verifiers />
        <BanAuthor />
        <BanVerifier />
      </StyledMain>
    </>
  );
};

export default Governance;
