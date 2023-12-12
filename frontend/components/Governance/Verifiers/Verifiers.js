"use client";

// ReactJs
import { useEffect, useState } from "react";

// Toastify
import { ToastContainer, toast } from "react-toastify";

// Wagmi
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
// import { useAccount } from "wagmi";

// Viem
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { hardhat } from "viem/chains";

// Contract's information
import { Voting_Abi, Dao_Abi, contractAddress_Voting } from "@/constants/index";

import { Flex } from "../../Voting/Styles/Flex.styled";
import { H2 } from "../../Voting/Styles/H2.styled";
import { Input } from "../../Voting/Styles/Input.styled";
import { Button } from "../../Voting/Styles/Button.styled";
import { Label } from "../../Voting/Styles/Label.styled";

const Verifiers = () => {
  // Voter Information
  const [verifier, setVerifier] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [verifierRegisteredEvents, setverifierRegisteredEvents] = useState([]);

  // Event handling function
  const getVerifierRegisteredEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem(
          "event VerifierCreated(address indexed _verifier, uint256 date)"
        ),
        fromBlock: 0n,
        toBlock: "latest",
      });

      setverifierRegisteredEvents(logs.map((log) => log.args._verifier));
      toast.success("Verifier Added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fonction pour ajouter un électeur
  const createVerifier = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "createVerifier",
        args: [verifier],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });
      getVerifierRegisteredEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Label>
      <H2>Add Verifier</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={verifier}
          onChange={(e) => setVerifier(e.target.value)}
        />
        <Button type="button" onClick={createVerifier}>
          Submit
        </Button>
      </Flex>
    </Label>
  );
};

export default Verifiers;
