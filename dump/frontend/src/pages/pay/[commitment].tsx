import { useRouter } from 'next/router'
import { Center } from "@chakra-ui/react";
import base64url from "base64url";
import { BigNumber } from "ethers";
import UrlIsNotValid from "../../components/UrlIsNotValid";
import PayCommitment from "../../components/PayCommitment";
import { useEffect, useState } from "react";

const Pay = () => {
  const router = useRouter();
  const { commitment } = router.query;

  const [rawCommitment, setRawCommitment] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    if (commitment) {
      try {
        setRawCommitment(BigNumber.from("0x" + base64url.decode(commitment as string)));
      } catch (e) {
        console.log(e);
        setRawCommitment(BigNumber.from(0));
      }
    }
  }, [commitment]);

  return (
    <Center>
      {
        !rawCommitment.isZero() ?
          <PayCommitment commitment={rawCommitment}/> :
          <UrlIsNotValid/>
      }
    </Center>
  );
}

export default Pay;