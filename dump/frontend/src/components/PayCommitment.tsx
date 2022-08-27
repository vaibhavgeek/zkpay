import { Button, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons"
import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import LinkIsAlreadyPayed from "./LinkIsAlreadyPayed";

const PayCommitment = (props: { commitment: BigNumber }) => {

  const [walletConnected, setWalletConnected] = useState<boolean>();

  const [approveLoading, setApproveLoading] = useState<boolean>();
  const [tokenApproved, setTokenApproved] = useState<boolean>();

  const [payLoading, setPayLoading] = useState<boolean>();
  const [payed, setPayed] = useState<boolean>();

  const [payedPreviously, setPayedPreviously] = useState<boolean>();

  const context = useContext(GlobalContext);

  useEffect(() => {
    if (context.provider) {
      setWalletConnected(true);
    }
  }, [context.provider]);

  useEffect(() => {
    if (context.provider && context.easyLinkToken && context.easyLink) {
      const easyLink = context.easyLink;
      const token = context.easyLinkToken;
      context.provider.getSigner(0)
        .getAddress()
        .then(address => {
          return token.allowance(address, easyLink.address);
        })
        .then(allowance => {
          if (allowance.gte(ethers.utils.parseEther("1"))) {
            setTokenApproved(true);
          } else {
            setTokenApproved(false);
          }
        })
        .catch(console.log);

    }
  }, [context.provider, context.easyLinkToken, context.easyLink]);

  useEffect(() => {
    if (context.provider && context.easyLink) {
      context.easyLink.commitments(props.commitment)
        .then((payed: boolean) => {
          setPayedPreviously(payed);
        })
        .catch(console.log);

    }
  }, [context.provider, context.easyLink, props.commitment]);

  const connectWallet = async () => {
    await context.connect();
  };

  const approveToken = async () => {
    if (!context.easyLink) {
      console.log("No easyLink smart contract");
      return
    }
    if (!context.easyLinkToken) {
      console.log("No easyLinkToken smart contract");
      return
    }

    setApproveLoading(true);
    try {
      const transaction = await context.easyLinkToken.approve(context.easyLink.address, ethers.utils.parseEther("1"));
      await transaction.wait(1);
    } finally {
      setApproveLoading(false);
    }

    setTokenApproved(true);
  };

  const payCommitment = async () => {
    if (!context.easyLink) {
      console.log("No easyLink smart contract");
      return
    }

    setPayLoading(true);
    try {
      const transaction = await context.easyLink.deposit(props.commitment);
      await transaction.wait(1);
    } finally {
      setPayLoading(false);
    }

    setPayed(true);
  }

  return (
    <>
      {payedPreviously ?
        <LinkIsAlreadyPayed/> :
        <VStack>
          <>
            <Text>First you need to connect your wallet:</Text>
            <Button
              isDisabled={walletConnected}
              onClick={connectWallet}
            >
              {walletConnected ? <CheckIcon/> : "Connect"}
            </Button>
          </>
          <>
            <Text>Second you need to approve required amount of tokens:</Text>
            <Button
              isDisabled={!walletConnected || tokenApproved}
              onClick={approveToken}
              isLoading={approveLoading}
            >
              {tokenApproved ? <CheckIcon/> : "Approve"}
            </Button>
          </>
          <>
            <Text>And the last step is to pay:</Text>
            <Button
              isDisabled={!walletConnected || !tokenApproved || payed}
              onClick={payCommitment}
              isLoading={payLoading}
            >
              {payed ? <CheckIcon/> : "Pay"}
            </Button>
          </>
        </VStack>}
    </>
  );
};

export default PayCommitment;