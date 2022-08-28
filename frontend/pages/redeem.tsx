/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@mui/material/Button";
import * as React from "react";
import { useMetaMask } from "metamask-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MerkleTree } from "fixed-merkle-tree";
import { generateProof } from "./utils/proof";
import { populateEvents } from "./utils/events";
import { decodeNote } from "./utils/note";
import { BigNumber, ethers } from "ethers";
import {constants} from "./utils/address";
import { CONTRACT_TO_ABI } from "./utils/contracts";
import { PoseidonHasher } from "./utils/hasher";
const buildPoseidon = require("circomlibjs").buildPoseidon;
import { LocalStoredEvent } from "./utils/storage";
import TextField from '@mui/material/TextField';

const hasher = new PoseidonHasher(await buildPoseidon());

export default function Redeem() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [secretBase64, setSecretBase64] = useState<string>();
  const [error, setError] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [nullifier, setNullifier] = useState<string>();
  const [redeemLoading, setRedeemLoading] = useState<boolean>();
  const [redeemed, setRedeemed] = useState<boolean>();

  const [eventsLoading, setEventsLoading] = useState<boolean>(false)
  const [events, setEvents] = useState<LocalStoredEvent[]>([]);

  useEffect(() => {
    if(chainId !== null){
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants.polygonMumbai.ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants.polygonMumbai.ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));
    

    setEventsLoading(true);
    populateEvents(ZKPayLink, chainId, provider)
      .then(events => setEvents(events))
      .catch(console.log)
      .finally(() => setEventsLoading(false));
    }
  }, []);


  useEffect(() => {
    if (!secretBase64) {
      return;
    }
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants.polygonMumbai.ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants.polygonMumbai.ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));

    setRedeemLoading(true);
    const [nullifierLocal, secretLocal] = decodeNote(secretBase64);
    // if (!nullifierLocal || !secretLocal) {
    //   setError("Provided secret is not valid");
    //   setRedeemLoading(false);
    //   return;
    // }

    setNullifier(nullifierLocal.toString());
    setSecret(secretLocal.toString());


    const commitment = hasher.hash(BigNumber.from(nullifierLocal), BigNumber.from(secretLocal)).toString();
    const paidCommitment = events.filter(it => it.commitment === commitment);
    if (paidCommitment.length == 0) {
      setError("Related payment link wasn't payed yet");
      setRedeemLoading(false);
      return;
    }

    setError(undefined);
    setRedeemLoading(false);
  }, [secretBase64, events, hasher]);

  const redeem = async () => {
    console.log("the nullifier", nullifier);
    console.log("the secret", secret);
    if(nullifier !== undefined && secret !== undefined){
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants.polygonMumbai.ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants.polygonMumbai.ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));



    setRedeemLoading(true);

    const commitment = hasher.hash(BigNumber.from(nullifier), BigNumber.from(secret)).toString();

    const tree = new MerkleTree(10, [], {
      hashFunction: (a, b) => hasher.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
      zeroElement: "12339540769637658105100870666479336797812683353093222300453955367174479050262"
    });
    tree.bulkInsert(events.map(it => it.commitment));

    const merkleProof = tree.proof(commitment);

    const address = await provider?.getSigner(0).getAddress() as string;
    const root = merkleProof.pathRoot.toString();
    
    const proof = await generateProof({
      recipient: BigNumber.from(address).toString(),
      root: root,
      nullifier: nullifier,
      secret: secret,
      pathElements: [...merkleProof.pathElements].map(it => it.toString()),
      pathIndices: [...merkleProof.pathIndices]
    });
    console.log(proof);
    const pathAsNumber = [...merkleProof.pathIndices]
      .reverse()
      .reduce((previousValue, currentValue) => previousValue * 2 + currentValue, 0);


    const nullifierHash = hasher.hash(BigNumber.from(nullifier), BigNumber.from(pathAsNumber)).toString();

    const transaction = await ZKPayLink.withdraw((proof as any).a, (proof as any).b, (proof as any).c, nullifierHash, address, root);
    await transaction.wait(1);

    console.log(transaction);
    setRedeemLoading(false);
    setRedeemed(true);
  }
  }
  const onSecretChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log("vlaue in browser", e.target.value);
    setSecretBase64(e.target.value);
  }
  return <div>
    <TextField
        id="outlined-name"
        onChange={onSecretChange}
      />
   
     {status === "initializing" && (
        <div>Synchronisation with MetaMask ongoing...</div>
      )}
      {status === "unavailable" && <div>MetaMask not available :</div>}
      {status === "connecting" && <div>Connecting...</div>}
      {status === "notConnected" && (
        <button onClick={connect}>Connect to MetaMask</button>
      )}
      {status === "connected" && (
        <div>
          Connected account {account} on chain ID {chainId}
        </div>

      )}
       <Button onClick={redeem}>
          {redeemed ? "Already Redemmed" : "Redeem"}
        </Button>
  </div>;
}
