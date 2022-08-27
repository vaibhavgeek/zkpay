// import "@nomiclabs/hardhat-ethers"
// // @ts-ignore
// import { groth16 } from "snarkjs";
// // @ts-ignore
// import { utils } from "ffjavascript";

// export type Input = {
//   recipient: string,
//   root: string,
//   nullifier: string,
//   secret: string,
//   pathElements: string[],
//   pathIndices: number[]
// }

// export type Proof = {
//   pi_a: string[3],
//   pi_b: string[3][2],
//   pi_c: string[2],
//   protocol: string,
//   curve: string
// }

// export const generateProof = async (input: Input): Promise<Proof> => {
//   const { proof } = await groth16.fullProve(
//     utils.stringifyBigInts(input),
//     "./artifacts/circuits/withdraw.wasm",
//     "./artifacts/circuits/withdraw.zkey");

//   return proof;
// }