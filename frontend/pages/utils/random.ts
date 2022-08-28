import { BigNumber, ethers } from "ethers";

export const randomBN = (nbytes = 31) => BigNumber.from(ethers.utils.randomBytes(nbytes));