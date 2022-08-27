// import "@nomiclabs/hardhat-ethers"
// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { getEncryptionPublicKey } from "@metamask/eth-sig-util";
// import { randomBN } from "../frontend/src/utils/random";
// import { decryptData, encryptData } from "../frontend/src/utils/encryption";

// describe("Encryption", () => {
//   it("should generate private key and encrypt/decrypt data", async () => {
//     const wallet = ethers.Wallet.createRandom();

//     const message = "Sign this message to generate your EasyLink private key.\n Before signing check that you are at EasyLink website";
//     const sign = await wallet.signMessage(message);

//     const privateKey = ethers.utils.sha256(sign).slice(2);
//     const encryptionKey = getEncryptionPublicKey(privateKey);

//     const secret = randomBN().toHexString();
//     const encryptedMessage = encryptData(encryptionKey, ethers.utils.arrayify(secret));

//     const decryptedMessage = decryptData(privateKey, encryptedMessage);

//     expect("0x" + decryptedMessage.toString('hex')).to.be.equal(secret);
//   });
// });