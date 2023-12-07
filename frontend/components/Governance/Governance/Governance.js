"use client";

// ReactJs
import { useState, useEffect } from "react";

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
  contractAddress_Dao,
  contractAddress_Voting,
} from "@/constants/index";

const Governance = () => {
  const [governanceData01, setGovernanceData01] = useState("");
  const [governanceData02, setGovernanceData02] = useState("");
  const [governanceData03, setGovernanceData03] = useState("");
  const [governanceData04, setGovernanceData04] = useState("");

  const getPromotionValues = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: Dao_Abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData01(data);
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

  const changePromotionValues01 = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Voting_Abi,
        functionName: "changeTotalReportNumber",
      });
      const { hash } = await writeContract(request);
      alert("Contract written");
      const data = await waitForTransaction({
        hash: hash,
      });

      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  };
  const changePromotionValues02 = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData(data);
    } catch (err) {
      alert(err.message);
    }
  };
  const changePromotionValues03 = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData(data);
    } catch (err) {
      alert(err.message);
    }
  };
  const changePromotionValues04 = async () => {
    try {
      const data = await readContract({
        address: contractAddress_Dao,
        abi: abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    getPromotionValues();
  }, []);

  return (
    <>
      <StyledMain>
        <H1Styled>GOVERNANCE</H1Styled>
        <H2Styled>Promotion Rules</H2Styled>
        {/* <button type="button" onClick={getPromotionValues}>
          Get Promotion Rules
        </button> */}

        {governanceData01 &&
          governanceData02 &&
          governanceData03 &&
          governanceData04 && (
            <>
              <UlStyled>
                <LiStyled>
                  Minimum Required Report Number For Verifier Promotion: {""}
                  <strong>{governanceData01.toString()}</strong>
                  <StyledButton type="button" onClick={changePromotionValues01}>
                    Change
                  </StyledButton>
                </LiStyled>

                <LiStyled>
                  Minimum Required Verification Number For Author Promotion:{" "}
                  <strong>{governanceData02.toString()}</strong>
                  <StyledButton type="button" onClick={changePromotionValues02}>
                    Change
                  </StyledButton>
                </LiStyled>
                <LiStyled>
                  Minimum Required Period For Verifier Promotion: {""}
                  <strong>
                    {governanceData03} {""} Months
                  </strong>
                  <StyledButton type="button" onClick={changePromotionValues03}>
                    Change
                  </StyledButton>
                </LiStyled>
                <LiStyled>
                  Minimum Required Period For Author Promotion: {""}
                  <strong>
                    {governanceData04} {""} Months
                  </strong>
                  <StyledButton type="button" onClick={changePromotionValues04}>
                    Change
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
