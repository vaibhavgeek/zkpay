// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./MerkleTree.sol";
import "./Verifier.sol";

contract ZKPayLink is MerkleTree, ReentrancyGuard {
    address public immutable token;
    uint256 public immutable amount;

    address public immutable verifier;

    mapping(uint256 => bool) public commitments;
    mapping(uint256 => bool) public spentNullifiers;

    event Deposit(
        bytes32 _address,
        bytes Note,
        uint256 commitment,
        uint32 index
    );
    event Withdrawl(address to, uint256 nullifier);

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

    function deposit(
        bytes32 _address,
        bytes calldata Note,
        uint256 commitment
    ) external payable nonReentrant {
        require(!commitments[commitment], "ZKPay: Commitment already exist");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        uint32 index = insert(commitment);
        commitments[commitment] = true;

        emit Deposit(_address, Note, commitment, index);
    }

    function withdraw(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256 _nullifier,
        address _address,
        uint256 _root
    ) external payable nonReentrant {
        require(!spentNullifiers[_nullifier], "Zkpay: Note already spent");
        require(isKnownRoot(_root), "Merkle Root does not exist");
        require(
            Verifier(verifier).verifyProof(
                a,
                b,
                c,
                [_nullifier, uint256(uint160(_address)), _root]
            ),
            "Invalid widthraw Proof"
        );

        spentNullifiers[_nullifier] = true;

        IERC20(token).transfer(_address, amount);
        emit Withdrawl(_address, _nullifier);
    }
}
