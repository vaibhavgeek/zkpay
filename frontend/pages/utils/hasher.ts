import { BigNumber } from "ethers";

export class PoseidonHasher {
  poseidon: any;

  constructor(poseidon: any) {
    this.poseidon = poseidon;
  }

  hash(left: BigNumber, right: BigNumber) {
    const hash = this.poseidon([left, right]);
    return BigNumber.from(this.poseidon.F.toString(hash));
  }
}