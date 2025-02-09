// @ts-ignore
const groth16 = require("snarkjs").groth16;
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

export type Proof = {
  pi_a: string[3],
  pi_b: string[3][2],
  pi_c: string[2],
  protocol: string,
  curve: string
}

export const generateProof = async (input: Input): Promise<Proof> => {
  const { proof , publicSignals} = await groth16.fullProve(
    utils.stringifyBigInts(input),
    "./withdraw.wasm",
    "./withdraw.zkey");
    console.log("public signals", publicSignals);

  return proof;
}