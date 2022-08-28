import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import hre, { ethers } from "hardhat";
import fs from "fs-extra";


const deployContractGeneric = async (name: string, network:string) => {
  const contractBase = await ethers.getContractFactory(name);
  console.log("get Contract Factory?");
  const deployedContract = await contractBase.deploy();
  console.log(`${name} Contract Deployed at: `, deployedContract.address);

  const addressesJson = `./scripts/contractAddresses/${network}.json`;
  const addressData = await fs.readJSON(addressesJson);
  console.log("address data", addressData);
  addressData[name] = deployedContract.address;
  await fs.writeJson(addressesJson, addressData);
}
const checkIfDeployed = async (name: string, network: string) => {
  const addressesJson = `./scripts/contractAddresses/${network}.json`;
  console.log("addressJSON PATH", addressesJson);
  const addressData = await fs.readJSON(addressesJson);
  console.log("address data", addressData);
  if(addressData.hasOwnProperty(name)){
      console.log("eureka");
      return true;
  }
  else{
    console.log("Expected result");
    return false;
  }
}

const deploy = async () => {
  console.log("network name : ", hre.network.name);
  
  if (!(await checkIfDeployed("ZKPayToken", hre.network.name))) {
    console.log("deploy contract token", "ZKPayToken");
    await deployContractGeneric("ZKPayToken", hre.network.name)
  }
  else {
    console.log("already exists, ZKPayToken");
  }
  if (!(await checkIfDeployed("Verifier", hre.network.name))) {
    await deployContractGeneric("Verifier", hre.network.name)
  }
  if (!(await checkIfDeployed("PoseidonHasher", hre.network.name))) {
    await deployContractGeneric("PoseidonHasher", hre.network.name)
  }

  const amount = ethers.utils.parseEther("1");
  const addressesJson = `./scripts/contractAddresses/${hre.network.name}.json`;
  
  const addressData = await fs.readJSON(addressesJson);
  const tokenAddress = addressData["ZKPayToken"];
  const verifierAddress = addressData["Verifier"];
  const hasherAddress = addressData["PoseidonHasher"];

  const ZKPayLink = await ethers.getContractFactory("ZKPayLink");
  const payLink = await ZKPayLink.deploy(tokenAddress, amount, verifierAddress, 10, hasherAddress);
  console.log("PayLink deployed to:", payLink.address);
  addressData["ZKPayLink"] = payLink.address;
  await fs.writeJson(addressesJson, addressData);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });