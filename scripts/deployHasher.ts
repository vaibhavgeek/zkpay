import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import { ethers } from "hardhat";
import fs from "fs";

export const deployHasher = async (path: string) => {
  if (fs.existsSync(path)) {
    console.log("Hasher already exists");
    return;
  }

  const PoseidonHasher = await ethers.getContractFactory("PoseidonHasher");
  const hasher = await PoseidonHasher.deploy();
  console.log("PoseidonHasher deployed to:", hasher.address);

  fs.writeFileSync(path, hasher.address);
}