import { ethers } from "ethers";

export function shortenAddress(address: string, chars = 8): string {
  const parsed = ethers.utils.getAddress(address);
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}