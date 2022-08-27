import { Box, Button, Center, Text, Textarea, VStack } from "@chakra-ui/react"
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { BigNumber } from "ethers";
import { MerkleTree } from "fixed-merkle-tree";
import { generateProof } from "../utils/proof";
import { CheckIcon } from "@chakra-ui/icons";
import { populateEvents } from "../utils/events";
import { LocalStoredEvent } from "../utils/storage";
import { decodeNote } from "../utils/note";

const Redeem = () => {

  const context = useContext(GlobalContext);

  const [secretBase64, setSecretBase64] = useState<string>();
  const [error, setError] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [nullifier, setNullifier] = useState<string>();
  const [redeemLoading, setRedeemLoading] = useState<boolean>();
  const [redeemed, setRedeemed] = useState<boolean>();

  const [eventsLoading, setEventsLoading] = useState<boolean>(false)
  const [events, setEvents] = useState<LocalStoredEvent[]>([]);

  useEffect(() => {
    if (!context.easyLink || !context.chainId || !context.provider) {
      console.log("context.easyLink", context.easyLink);
      console.log("context.chainId", context.chainId);
      console.log("context.provider", context.provider);
      return;
    }

    setEventsLoading(true);
    populateEvents(context.easyLink, context.chainId, context.provider)
      .then(events => setEvents(events))
      .catch(console.log)
      .finally(() => setEventsLoading(false));
  }, [context.easyLink, context.chainId, context.provider]);

  useEffect(() => {
    if (!secretBase64) {
      return;
    }

    setRedeemLoading(true);
    const [nullifierLocal, secretLocal] = decodeNote(secretBase64);
    if (!nullifierLocal || !secretLocal) {
      setError("Provided secret is not valid");
      setRedeemLoading(false);
      return;
    }

    setNullifier(nullifierLocal.toString());
    setSecret(secretLocal.toString());

    const commitment = context.hasher.hash(BigNumber.from(nullifierLocal), BigNumber.from(secretLocal)).toString();
    const paidCommitment = events.filter(it => it.commitment === commitment);
    if (paidCommitment.length == 0) {
      setError("Related payment link wasn't payed yet");
      setRedeemLoading(false);
      return;
    }

    setError(undefined);
    setRedeemLoading(false);
  }, [secretBase64, events, context.hasher]);

  const redeem = async () => {
    if (!context.easyLink || !context.chainId) {
      console.log("redeem() context.easyLink", context.easyLink);
      console.log("redeem() context.chainId", context.chainId);
      return;
    }

    if (!secret || !nullifier) {
      console.log("redeem() nullifier", nullifier);
      console.log("redeem() secret", secret);
      return;
    }

    setRedeemLoading(true);
    const commitment = context.hasher.hash(BigNumber.from(nullifier), BigNumber.from(secret)).toString();

    const tree = new MerkleTree(10, [], {
      hashFunction: (a, b) => context.hasher.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
      zeroElement: "12339540769637658105100870666479336797812683353093222300453955367174479050262"
    });
    tree.bulkInsert(events.map(it => it.commitment));

    const merkleProof = tree.proof(commitment);

    const address = await context.provider?.getSigner(0).getAddress() as string;
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
    const nullifierHash = context.hasher.hash(BigNumber.from(nullifier), BigNumber.from(pathAsNumber)).toString();

    const transaction = await context.easyLink.withdraw(proof.a, proof.b, proof.c, nullifierHash, address, root);
    await transaction.wait(1);

    console.log(transaction);
    setRedeemLoading(false);
    setRedeemed(true);
  }

  const onSecretChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setSecretBase64(e.target.value);
  }

  return (
    <Center>
      <VStack w={"100%"}>
        <Box w={"50%"}>
          <Textarea onChange={onSecretChange}
                    isDisabled={eventsLoading || !context.provider}
                    placeholder='Please provider a secret to redeem tokens'/>
        </Box>
        <Box>
          <Text>{error}</Text>
        </Box>
        <Button
          isDisabled={!context.provider || error !== undefined || redeemed || !secretBase64}
          onClick={redeem}
          isLoading={redeemLoading}
        >
          {redeemed ? <CheckIcon/> : "Redeem"}
        </Button>
      </VStack>
    </Center>
  );
};

export default Redeem;