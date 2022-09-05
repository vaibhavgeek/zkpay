import { BigNumber } from "ethers";
import base64url from "base64url";

export const decodeNote = (noteBase64: string): BigNumber[]  => {
  const decoded = base64url.decode(noteBase64);
  const dividerIndex = decoded.indexOf("#");
  if (dividerIndex == -1) {
    return [];
  }

  try {
    const nullifier = BigNumber.from(decoded.slice(0, dividerIndex));
    const secret = BigNumber.from(decoded.slice(dividerIndex + 1));
    return [nullifier, secret];
  } catch (e) {
    console.log(e);
    return [];
  }
}