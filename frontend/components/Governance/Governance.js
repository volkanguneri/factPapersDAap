"use client";

// ReactJs
import { useState } from "react";

// Wagmi
import { readContract } from "@wagmi/core";

// Contract's information
import { Dao_Abi, contractAddress } from "@/constants/index";

const Governance = () => {
  const [governanceData, setGovernanceData] = useState("");

  const getPromotionValues = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Dao_Abi,
        functionName: "VrequiredReportsForVerifierPromotion",
      });
      setGovernanceData(data);
      console.log(governanceData.voteCount);
    } catch (err) {
      alert(err.message);
    }
  };

  //   const changePromotionValues = async () => {
  //     try {
  //       const data = await readContract({
  //         address: contractAddress,
  //         abi: abi,
  //         functionName: "VrequiredReportsForVerifierPromotion",
  //       });
  //       setGovernanceData(data);
  //       console.log(governanceData.voteCount);
  //     } catch (err) {
  //       alert(err.message);
  //     }
  //   };

  return (
    <>
      <label>
        <h2>Promotion Rules</h2>
        <button type="button" onClick={getPromotionValues}>
          Get Promotion Value
        </button>

        {governanceData && (
          <>
            <ul>
              <H2>Proposal Information </H2>
              <li>
                <strong>
                  Minimum Required Report Number For Verifier Promotion:
                </strong>{" "}
                {governanceData}
              </li>
            </ul>
          </>
        )}
      </label>
    </>
  );
};

export default Governance;
