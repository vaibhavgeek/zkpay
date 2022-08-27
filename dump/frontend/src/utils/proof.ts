import { BigNumberish } from "ethers";
// @ts-ignore
import { groth16 } from "snarkjs";
// @ts-ignore
import { utils } from "ffjavascript";

export type Input = {
  recipient: string,
  root: string,
  nullifier: string,
  secret: string,
  pathElements: string[],
  pathIndices: number[]
}

type ProofLocal = {
  pi_a: string[3],
  pi_b: string[3][2],
  pi_c: string[2],
  protocol: string,
  curve: string
}

export type Proof = {
  a: [BigNumberish, BigNumberish],
  b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
  c: [BigNumberish, BigNumberish]
}

export const generateProof = async (input: Input): Promise<Proof> => {
  let { proof } = await groth16.fullProve(
    utils.stringifyBigInts(input),
    "./withdraw.wasm",
    "./withdraw.zkey");
  proof = proof as ProofLocal;

  return {
    a: [proof.pi_a[0], proof.pi_a[1]] as [BigNumberish, BigNumberish],
    b: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]] as [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
    c: [proof.pi_c[0], proof.pi_c[1]] as [BigNumberish, BigNumberish]
  };
}