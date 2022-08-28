import * as React from "react";
import Button from "@mui/material/Button";
import { useMetaMask } from "metamask-react";

export default function Buttons() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  console.log(status);
  console.log("ethereum", ethereum);
  return (
    <div>
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
      
      <Button href="/new" color="secondary">
        Create Pay Link
      </Button>
      <Button href="/redeem" variant="contained" color="success">
        Redeem Tokens!
      </Button>
    </div>
  );
}
