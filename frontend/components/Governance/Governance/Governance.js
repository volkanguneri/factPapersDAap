"use client";

// ReactJs
import { useState, useEffect } from "react";

// React-Toast
import { toast } from "react-toastify";

// UseContext
import { useResultContext } from "../../UseContext/ResultContext";

import Authors from "../Authors/Authors";
import Verifiers from "../Verifiers/Verifiers";
import BanAuthor from "../BanAuthor/BanAuthor";
import BanVerifier from "../BanVerifier/BanVerifier";

import {
  StyledMain,
  StyledButton,
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

// Viem event handling
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

  const [minReportNum, setMinReportNum] = useState("");
  const [minVerifNum, setMinVerifNum] = useState("");
  const [minPeriodVerifierPro, setMinPeriodVerifierPro] = useState("");
  const [minPeriodAuthorPro, setMinPeriodAuthorPro] = useState("");

  const [requestNumberDataRN, setRequestNumberDataRN] = useState("");
  const [requestNumberDataVN, setRequestNumberDataVN] = useState("");
  const [requestNumberDataIV, setRequestNumberDataIV] = useState("");
  const [requestNumberDataIA, setRequestNumberDataIA] = useState("");

  const [votingId, setVotingId] = useState("");

  // ::::::::::::::::::::::::::::::::: GET PROMOTION VALUES:::::::::::::::::::::::::::::::::::::::::::::::::::

  const getPromotionValues = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setMinReportNum(data.toString());
    } catch (err) {
      toast.error(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VrequiredVerificationsForAuthorPromotion",
      });
      setMinVerifNum(data.toString());
    } catch (err) {
      toast.error(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VtimeIntervalForVerifierPromotion",
      });
      const dataString = data.toString();
      const inMonths = dataString / 60 / 60 / 24 / 30;

      setMinPeriodVerifierPro(inMonths);
    } catch (err) {
      toast.error(err.message);
    }
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VtimeIntervalForAuthorPromotion",
      });

      const dataString = data.toString();
      const inMonths = dataString / 60 / 60 / 24 / 30;

      setMinPeriodAuthorPro(inMonths);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // :::::::::::::::::::::::::::::::::::CHANGE PROMOTION VALUES::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const changeTotalReportNumber = async () => {
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
      toast.success("Voting Requested To Change Report Number For Promotion");
    } catch (err) {
      toast.error(err.message);
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
      toast.error(err.message);
    }
  };

  const changeTotalVerificationNumber = async () => {
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
      toast.success(
        "Voting Requested To Change Verification Number For Promotion"
      );
    } catch (err) {
      toast.error(err.message);
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
      toast.error(err.message);
    }
  };
  const changeTimeIntervalForVerifierPromotion = async () => {
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
      toast.success("Voting Requested To Change Verifier Period For Promotion");
    } catch (err) {
      toast.error(err.message);
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
      toast.error(err.message);
    }
  };
  const changeTimeIntervalForAuthorPromotion = async () => {
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
      toast.success("Voting Requested To Change Author Period For Promotion");
    } catch (err) {
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.success("Voting For Report Number Started");
    } catch (err) {
      toast.error(err.message);
    }
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
      toast.success("Voting For Verification Number Started");
    } catch (err) {
      toast.error(err.message);
    }
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
      toast.success("Voting For Verifier Promotion Period Started");
    } catch (err) {
      toast.error(err.message);
    }
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
      toast.success("Voting For Author Promotion Period Started");
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
      console.log("votingId:", data.toString());
    } catch (err) {
      toast.error(err.message);
    }
  };

  console.log("outside", votingId);

  const displayWinningProposalNum = async () => {
    console.log("inside", votingId, winningProposalNum);

    switch (votingId) {
      case "0":
        console.log("break");
        break;
      case "1":
        return setMinReportNum(winningProposalNum);
      case "2":
        return setMinVerifNum(winningProposalNum);
      case "3":
        return setMinPeriodVerifierPro(winningProposalNum);
      case "4":
        setMinPeriodAuthorPro(winningProposalNum);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getVotingId();
      console.log("inside useEffect", votingId);
      displayWinningProposalNum();
    };
    fetchData();
  }, [winningProposalNum, votingId]);

  useEffect(() => {
    getPromotionValues();
    readRequestNumbers();
  }, []);

  return (
    <>
      <StyledMain>
        <H2Styled>Promotion Rules</H2Styled>

        {minReportNum &&
          minVerifNum &&
          minPeriodVerifierPro &&
          minPeriodAuthorPro && (
            <>
              <UlStyled>
                <LiStyled>
                  <PSTyled>
                    Minimum Report Number For Verifier Promotion: {""}
                  </PSTyled>
                  <strong>{minReportNum}</strong>
                  <StyledButton type="button" onClick={changeTotalReportNumber}>
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
                  <strong>{minVerifNum.toString()}</strong>
                  <StyledButton
                    type="button"
                    onClick={changeTotalVerificationNumber}
                  >
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
                    {minPeriodVerifierPro} {""} Mo
                  </strong>
                  <StyledButton
                    type="button"
                    onClick={changeTimeIntervalForVerifierPromotion}
                  >
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
                    {minPeriodAuthorPro} {""} Mo
                  </strong>
                  <StyledButton
                    type="button"
                    onClick={changeTimeIntervalForAuthorPromotion}
                  >
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
