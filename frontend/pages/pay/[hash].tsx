import * as React from "react";
import { useMetaMask } from "metamask-react";
import { useRouter } from 'next/router'

import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import {constants} from "../utils/address";
import { CONTRACT_TO_ABI } from "../utils/contracts";
import Button from "@mui/material/Button";
import {randomBN} from "../utils/random";
import base64url from "base64url";

const Pay = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [walletConnected, setWalletConnected] = useState<boolean>();
  const router = useRouter();
  const { hash } = router.query;
  const [approveLoading, setApproveLoading] = useState<boolean>();
  const [tokenApproved, setTokenApproved] = useState<boolean>();

  const [payLoading, setPayLoading] = useState<boolean>();
  const [payed, setPayed] = useState<boolean>();
  const chainName = "polygonMumbai";
  const [payedPreviously, setPayedPreviously] = useState<boolean>();
  console.log("ethereum", ethereum);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants[chainName].ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants[chainName].ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));
  
      provider.getSigner(0)
        .getAddress()
        .then(address => {
          return ZKPayToken.allowance(address, ZKPayLink.address);
        })
        .then(allowance => {
          if (allowance.gte(ethers.utils.parseEther("1"))) {
            setTokenApproved(true);
          } else {
            setTokenApproved(false);
          }
        })
        .catch(console.log);

    
  
        ZKPayLink.commitments(hash)
        .then((payed: boolean) => {
          setPayedPreviously(payed);
        })
        .catch(console.log);


  }, []);


  const approveToken = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants[chainName].ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants[chainName].ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));
  
    setApproveLoading(true);
    try {
      const transaction = await ZKPayToken.approve(ZKPayLink.address, ethers.utils.parseEther("1"));
      await transaction.wait(1);
    } finally {
      setApproveLoading(false);
    }

    setTokenApproved(true);
  };

  const payCommitment = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const ZKPayLink = new ethers.Contract(constants[chainName].ZKPayLink , CONTRACT_TO_ABI["ZKPayLink"], provider.getSigner(0));
    const ZKPayToken = new ethers.Contract(constants[chainName].ZKPayToken, CONTRACT_TO_ABI["ZKPayToken"] ,  provider.getSigner(0));
  
    setPayLoading(true);
    // try {
      const encryptedNote = randomBN(32).toHexString();
      const accountAddress = randomBN(32).toHexString();
      // console.log(encryptedNote);
      // console.log(accountAddress);
     // const bytesAddress = ethers.utils.formatBytes32String(account as any);
      const rawCommitment = BigNumber.from("0x" + base64url.decode(hash as string));
      const transaction = await ZKPayLink.deposit(accountAddress, encryptedNote, rawCommitment);
      await transaction.wait(1);
    // } finally {
    //   setPayLoading(false);
    // }

    setPayed(true);
  }


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
      <Button onClick={approveToken}>
              {tokenApproved ? "Already Approved" : "Approve"}
      </Button>


      <Button onClick={payCommitment}>
              {payed ? "Already Paid" : "Pay"}
      </Button>
  </div>;
}
export default Pay;