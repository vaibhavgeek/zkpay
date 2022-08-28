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

  return <div>
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
      <h2>Your link to receive 1 {!symbol ? 'token' : symbol} is:</h2>
      <p> {link}</p>
      <br/><br/><br/>
      {redeemSecret}
  </div>;
}
