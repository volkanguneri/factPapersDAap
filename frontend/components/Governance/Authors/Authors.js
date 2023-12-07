"use client";

// ReactJs
import { useEffect, useState } from "react";

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

const Authors = () => {
  // Voter Information
  const [author, setAuthor] = useState("");

  // Wagmi function / client creation for event listenning
  const client = usePublicClient();

  // Event information
  const [authorRegisteredEvents, setAuthorRegisteredEvents] = useState([]);

  // Event handling function
  const getAuthorRegisteredEvents = async () => {
    try {
      // get.Logs from viem
      const logs = await client.getLogs({
        address: contractAddress_Voting,
        event: parseAbiItem(
          "event AuthorCreated(address indexed author, uint256 date)"
        ),
        fromBlock: 0n,
        toBlock: "latest",
      });

      // Mise à jour du state avec les événements VoterRegistered
      setAuthorRegisteredEvents(logs.map((log) => log.args.author));
    } catch (err) {
      alert(err.message);
    }
  };

  // Fonction pour ajouter un électeur
  const createAuthor = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress_Voting,
        abi: Dao_Abi,
        functionName: "createAuthor",
        args: [author],
      });

      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash: hash,
      });

      getAuthorRegisteredEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  // Utilisation de useEffect pour s'abonner aux événements lors du montage initial
  useEffect(() => {
    getAuthorRegisteredEvents();
  }, []);

  return (
    <Label>
      <H2>Add Author</H2>
      <Flex>
        <Input
          placeholder="Enter an address"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Button type="button" onClick={createAuthor}>
          Submit
        </Button>
      </Flex>

      {authorRegisteredEvents ? (
        <div>
          <ul>
            {authorRegisteredEvents &&
              authorRegisteredEvents.map((address, index) => (
                <li key={index}>
                  <span>Added Author Address : </span>
                  {address}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </Label>
  );
};

export default Authors;
