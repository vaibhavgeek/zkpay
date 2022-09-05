import * as React from "react";
import { useMetaMask } from "metamask-react";
import { useContext, useEffect, useState } from "react";
import { randomBN } from "./utils/random";
import base64url from "base64url";
import Link from "next/link";
import { PoseidonHasher } from "./utils/hasher";

const buildPoseidon = require("circomlibjs").buildPoseidon;

const hasher = new PoseidonHasher(await buildPoseidon());

export default function New() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [origin, setOrigin] = useState<string>();
  const [link, setLink] = useState<string>();
  const [redeemSecret, setRedeemSecret] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  useEffect(() => {
    if (!origin && window) {
      setOrigin(window.location.origin);
    }

    if (origin && hasher) {
      const nullifier = randomBN();
      const secret = randomBN();

      const commitment = hasher.hash(nullifier, secret).toHexString().slice(2);
      const base64commitment = base64url.encode(commitment);
      setLink(origin + "/pay/" + base64commitment);
      setRedeemSecret(base64url.encode(`${nullifier.toHexString()}#${secret.toHexString()}`));
    }
  }, [origin, hasher])

  return <div className="flex flex-col w-full h-fit ">
     {status === "initializing" && (
        <div>Synchronisation with MetaMask ongoing...</div>
      )}
      {status === "unavailable" && <div>MetaMask not available :</div>}
      {status === "connecting" && <div>Connecting...</div>}
      {status === "notConnected" && (
        <button onClick={connect}>Connect to MetaMask</button>
      )}
      {status === "connected" && (
        <label className="text-lg text-white font-medium" >
          Connected account {(account.toString()).slice(0,7)}...{(account.toString()).slice(38)}<br/> on chain ID : {chainId}
        </label>
      )}
      <label>Your link to receive 1 {!symbol ? 'token' : symbol} is generated</label>
      <a href={link} target={'_blank'} ><button className="px-4 py-2 w-[20%] bg-blue-600 text-white mt-4 rounded-xl" >Go to Link</button></a>
      <label className="w-[20%] h-fit overflow-clip text-ellipsis" >{redeemSecret}</label>
      
  </div>;
}
