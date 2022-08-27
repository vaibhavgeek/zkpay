// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MerkleTree.sol";
import "./Verifier.sol";

contract ZKPayLink is MerkleTree {

    address public immutable token;
    uint256 public immutable amount;

    address public immutable verifier;

    mapping(uint256 => bool) public commitments;
    mapping(uint256 => bool) public spentNullifiers;

    event Deposit(bytes32 recipient, bytes encryptedNote, uint256 commitment, uint32 index);

    constructor(
        address _token,
        uint256 _amount,
        address _verifier,
        uint8 _levels,
        address _hasher
    ) MerkleTree(_levels, _hasher) {
        token = _token;
        amount = _amount;
        verifier = _verifier;
    }

    function deposit(bytes32 recipient, bytes calldata encryptedNote, uint256 commitment) external {
        require(!commitments[commitment], "Duplicated commitment");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        uint32 index = insert(commitment);
        commitments[commitment] = true;

        emit Deposit(recipient, encryptedNote, commitment, index);
    }

    function withdraw(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256 nullifierHash,
        address recipient,
        uint256 merkleRoot
    ) external {
        require(!spentNullifiers[nullifierHash], "Nullifier already spent");
        require(isValidRoot(merkleRoot), "Root is not valid");
        require(Verifier(verifier).verifyProof(a, b, c, [nullifierHash, uint256(uint160(recipient)), merkleRoot]), "Proof is not valid");

        spentNullifiers[nullifierHash] = true;

        IERC20(token).transfer(recipient, amount);
    }
}