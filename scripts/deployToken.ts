import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import { ethers } from "hardhat";
import fs from "fs";

export const deployToken = async (path: string) => {
  if (fs.existsSync(path)) {
    console.log("Token already exists");
    return;
  }

  const ZKPayToken = await ethers.getContractFactory("ZKPayToken");
  const zkToken = await ZKPayToken.deploy();

  console.log("ZKPayToken token deployed to:", zkToken.address);

  fs.writeFileSync(path, zkToken.address);
}