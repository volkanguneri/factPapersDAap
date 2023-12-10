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

// Components
import Spinner from "../../Spinner/Spinner";

import { Flex } from "../../Voting/Styles/Flex.styled";
import { H2 } from "../../Voting/Styles/H2.styled";
import { Input } from "../../Voting/Styles/Input.styled";
import { Button } from "../../Voting/Styles/Button.styled";
import { Label } from "../../Voting/Styles/Label.styled";

const BanVerifier = () => {
  // Voter Information
  const [bannedVerifier, setBannedVerifier] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [bannedVerifierEvents, setBannedVerifierEvents] = useState([]);

  // Toast
  const [loading, setLoading] = useState(false);

  // Event handling function
  const getBannedVerifierEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event VerifierBanned(address _verifier)"),
        fromBlock: 0n,
        toBlock: "latest",
      });

      setBannedVerifierEvents(logs.map((log) => log.args._verifier));
      let lastEvent = bannedVerifierEvents[bannedVerifierEvents.length - 1];
      toast.success(`Banned Verifier address: ${lastEvent}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const banVerifier = async () => {
    setLoading(true);
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "banVerifier",
        args: [bannedVerifier],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getBannedVerifierEvents();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Label>
      <H2>Ban Verifier</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={bannedVerifier}
          onChange={(e) => setBannedVerifier(e.target.value)}
        />
        <Button type="button" onClick={banVerifier}>
          Submit
        </Button>
      </Flex>
      <Spinner loading={loading} />
      <ToastContainer autoClose={3000} />
    </Label>
  );
};

export default BanVerifier;
