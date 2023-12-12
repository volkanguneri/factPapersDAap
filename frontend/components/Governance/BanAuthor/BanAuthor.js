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

const BanAuthor = () => {
  // Voter Information
  const [bannedAuthor, setBannedAuthor] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [bannedAuthorEvents, setBannedAuthorEvents] = useState([]);

  // Event handling function
  const getBannedAuthorEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem("event AuthorBanned(address _author)"),
        fromBlock: 0n,
        toBlock: "latest",
      });

      setBannedAuthorEvents(logs.map((log) => log.args._author));
      toast.success("Author Banned");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const banAuthor = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "banAuthor",
        args: [bannedAuthor],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getBannedAuthorEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Label>
      <H2>Ban Author</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={bannedAuthor}
          onChange={(e) => setBannedAuthor(e.target.value)}
        />
        <Button type="button" onClick={banAuthor}>
          Submit
        </Button>
      </Flex>
    </Label>
  );
};

export default BanAuthor;
