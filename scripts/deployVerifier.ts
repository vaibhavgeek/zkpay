import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import { ethers } from "hardhat";
import fs from "fs";

export const deployVerifier = async (path: string) => {
  if (fs.existsSync(path)) {
    console.log("Verifier already exists");
    return;
  }

  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  console.log("Verifier deployed to:", verifier.address);

  fs.writeFileSync(path, verifier.address);
}