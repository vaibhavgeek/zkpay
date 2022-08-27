// import "@nomiclabs/hardhat-ethers"
// import "@nomiclabs/hardhat-waffle"
// import { ethers } from "hardhat";
// import chai from "chai";
// import { EasyLink, EasyLinkToken, IPoseidonHasher, Verifier } from "../artifacts/contracts/types";
// // @ts-ignore
// import { buildPoseidon } from "circomlibjs";
// import { solidity } from "ethereum-waffle";
// import { MerkleTree } from "fixed-merkle-tree";
// import { BigNumber, BigNumberish } from "ethers";
// import { generateProof } from "./proof";
// import { randomBN } from "../frontend/src/utils/random";
// import { PoseidonHasher } from "../frontend/src/utils/hasher";
// import { getEncryptionPublicKey } from "@metamask/eth-sig-util";
// import { encryptData } from "../frontend/src/utils/encryption";

// chai.use(solidity);

// describe("EasyLink", () => {
//   let poseidon: PoseidonHasher;
//   let token: EasyLinkToken;
//   let verifier: Verifier;
//   let hasher: IPoseidonHasher;
//   let easyLink: EasyLink;

//   before(async () => {
//     poseidon = new PoseidonHasher(await buildPoseidon());
//   });

//   beforeEach(async () => {
//     const Token = await ethers.getContractFactory("EasyLinkToken");
//     token = (await Token.deploy()) as EasyLinkToken;

//     const amount = ethers.utils.parseEther("100");
//     await token.mint(amount);

//     const Verifier = await ethers.getContractFactory("Verifier");
//     verifier = (await Verifier.deploy()) as Verifier;

//     const Hasher = await ethers.getContractFactory("PoseidonHasher");
//     hasher = (await Hasher.deploy()) as IPoseidonHasher;

//     const EasyLink = await ethers.getContractFactory("EasyLink");
//     easyLink = (await EasyLink.deploy(token.address, ethers.utils.parseEther("1"),
//       verifier.address, 6, hasher.address)) as EasyLink;

//     await token.approve(easyLink.address, amount);
//   });

//   it("should have initial index set to 0", async () => {
//     const index = await easyLink.index();

//     chai.expect(index).to.be.equal(0);
//   });

//   it("should add a new commitment", async () => {
//     const commitment = randomBN();
//     const recipient = randomBN(32).toHexString();
//     const encryptedNote = randomBN(32).toHexString();

//     await chai.expect(easyLink.deposit(recipient, encryptedNote, commitment))
//       .to.emit(easyLink, "Deposit")
//       .withArgs(recipient, encryptedNote, commitment, 0);

//     const tree = new MerkleTree(6, [], {
//       hashFunction: (a, b) => poseidon.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
//       zeroElement: "12339540769637658105100870666479336797812683353093222300453955367174479050262"
//     });
//     tree.insert(commitment.toString());

//     const root = await easyLink.roots(0);

//     chai.expect(root).to.be.equal(tree.root);
//   });

//   it("should transfer tokens to contract when new commitment is added", async () => {
//     const commitment = randomBN();
//     const recipient = randomBN(32).toHexString();
//     const encryptedNote = randomBN(32).toHexString();

//     const account = (await ethers.getSigners())[0];
//     await chai.expect(() => easyLink.deposit(recipient, encryptedNote, commitment))
//       .to.changeTokenBalance(token, account, ethers.utils.parseEther("-1"));
//   });

//   it("should revert when duplicated commitment", async () => {
//     const commitment = randomBN();
//     const recipient = randomBN(32).toHexString();
//     const encryptedNote = randomBN(32).toHexString();

//     await chai.expect(easyLink.deposit(recipient, encryptedNote, commitment))
//       .to.emit(easyLink, "Deposit")
//       .withArgs(recipient, encryptedNote, commitment, 0);

//     await chai.expect(easyLink.deposit(randomBN(32).toHexString(), randomBN(32).toHexString(), commitment))
//       .to.revertedWith("Duplicated commitment");
//   });

//   it("should revert if nullifier is spent", async () => {
//     const [signer] = await ethers.getSigners();
//     const privateKey = ethers.utils.sha256(await signer.signMessage('some message')).slice(2);
//     const publicKeyBase64 = getEncryptionPublicKey(privateKey);
//     const publicKey = ethers.utils.hexlify(Buffer.from(publicKeyBase64, 'base64'));

//     const nullifier = randomBN();
//     const secret = randomBN();

//     const commitment = poseidon.hash(nullifier, secret);

//     const encryptedData = encryptData(publicKeyBase64, Buffer.concat([
//       ethers.utils.arrayify(nullifier),
//       ethers.utils.arrayify(secret)
//     ]));

//     // deposit
//     await chai.expect(easyLink.deposit(publicKey, encryptedData, commitment))
//       .to.emit(easyLink, "Deposit")
//       .withArgs(publicKey, encryptedData, commitment, 0);

//     // withdraw
//     const account = (await ethers.getSigners())[0];
//     const proof = await generateValidProof(poseidon, account.address, nullifier, secret);
//     await easyLink.withdraw(proof.a, proof.b, proof.c, proof.nullifierHash, proof.recipient, proof.merkleRoot);

//     // check nullifier is spent
//     chai.expect(await easyLink.spentNullifiers(proof.nullifierHash)).to.be.equal(true);

//     // try to withdraw one more time
//     await chai.expect(easyLink.withdraw(proof.a, proof.b, proof.c, proof.nullifierHash, proof.recipient, proof.merkleRoot))
//       .to.revertedWith("Nullifier already spent");
//   });

//   it("should revert if unknown root", async () => {
//     const proof = randomProof();

//     await chai.expect(easyLink.withdraw(proof.a, proof.b, proof.c, proof.nullifierHash, proof.recipient, proof.merkleRoot))
//       .to.revertedWith("Root is not valid");
//   });

//   it("should revert if not valid proof", async () => {
//     const nullifier = randomBN();
//     const secret = randomBN();
//     const commitment = poseidon.hash(nullifier, secret);
//     const recipient = randomBN(32).toHexString();
//     const encryptedNote = randomBN(32).toHexString();

//     await chai.expect(easyLink.deposit(recipient, encryptedNote, commitment))
//       .to.emit(easyLink, "Deposit")
//       .withArgs(recipient, encryptedNote, commitment, 0);

//     const proof = await generateValidProof(poseidon, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", nullifier, secret);

//     await chai.expect(easyLink.withdraw(proof.a, proof.b, proof.c, randomBN(), proof.recipient, proof.merkleRoot))
//       .to.revertedWith("Proof is not valid");
//   });

//   it("should withdraw tokens from a contract", async () => {
//     const [signer] = await ethers.getSigners();
//     const privateKey = ethers.utils.sha256(await signer.signMessage('some message')).slice(2);
//     const publicKeyBase64 = getEncryptionPublicKey(privateKey);
//     const publicKey = ethers.utils.hexlify(Buffer.from(publicKeyBase64, 'base64'));

//     const nullifier = randomBN();
//     const secret = randomBN();

//     const commitment = poseidon.hash(nullifier, secret);

//     const encryptedData = encryptData(publicKeyBase64, Buffer.concat([
//       ethers.utils.arrayify(nullifier),
//       ethers.utils.arrayify(secret)
//     ]));

//     // deposit
//     await chai.expect(easyLink.deposit(publicKey, encryptedData, commitment))
//       .to.emit(easyLink, "Deposit")
//       .withArgs(publicKey, encryptedData, commitment, 0);

//     // withdraw
//     const account = (await ethers.getSigners())[0];
//     const proof = await generateValidProof(poseidon, account.address, nullifier, secret);

//     await chai.expect(() => easyLink.withdraw(proof.a, proof.b, proof.c, proof.nullifierHash, proof.recipient, proof.merkleRoot))
//       .to.changeTokenBalance(token, account, ethers.utils.parseEther("1"));

//     chai.expect(await easyLink.spentNullifiers(proof.nullifierHash)).to.be.equal(true);
//   });
// });

// const generateValidProof = async (poseidon: PoseidonHasher, recipient: string, nullifier: BigNumber, secret: BigNumber) => {
//   const commitment = poseidon.hash(nullifier, secret);

//   const tree = new MerkleTree(6, [], {
//     hashFunction: (a, b) => poseidon.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
//     zeroElement: "12339540769637658105100870666479336797812683353093222300453955367174479050262"
//   });
//   tree.insert(commitment.toString());

//   const merkleProof = tree.proof(commitment.toString());
//   const proof = await generateProof({
//     recipient: recipient,
//     root: merkleProof.pathRoot.toString(),
//     nullifier: nullifier.toString(),
//     secret: secret.toString(),
//     pathElements: [...merkleProof.pathElements].map(it => it.toString()),
//     pathIndices: [...merkleProof.pathIndices]
//   });

//   const pathAsNumber = [...merkleProof.pathIndices]
//     .reverse()
//     .reduce((previousValue, currentValue) => previousValue * 2 + currentValue, 0);
//   const nullifierHash = poseidon.hash(BigNumber.from(nullifier), BigNumber.from(pathAsNumber)).toString();

//   return {
//     a: [proof.pi_a[0], proof.pi_a[1]] as [BigNumberish, BigNumberish],
//     b: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]] as [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
//     c: [proof.pi_c[0], proof.pi_c[1]] as [BigNumberish, BigNumberish],
//     nullifierHash: nullifierHash,
//     recipient: recipient,
//     merkleRoot: merkleProof.pathRoot
//   }
// }

// const randomProof = () => {
//   return {
//     a: [randomBN(), randomBN()] as [BigNumberish, BigNumberish],
//     b: [[randomBN(), randomBN()], [randomBN(), randomBN()]] as [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
//     c: [randomBN(), randomBN()] as [BigNumberish, BigNumberish],
//     nullifierHash: randomBN(),
//     recipient: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//     merkleRoot: randomBN()
//   }
// }