pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

include "./merkleproof.circom";

// https://betterprogramming.pub/understanding-zero-knowledge-proofs-through-the-source-code-of-tornado-cash-41d335c5475f

/*
A node is in merkle tree or not is determined from the merkle root itself.  
    Prove that I know (root, nullifier, secret, merkleProof) such that:
    - poseidon(nullifier, secret) is in merkle root 
    - poseidon(nullifier, pathIndices) = nullifierHash
*/
template Withdraw(levels) {

    signal input recipient;
    signal input root;
    signal input nullifier;
    signal input secret;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal output nullifierHash;

    component commitmentHasher = Poseidon(2);
    commitmentHasher.inputs[0] <== nullifier;
    commitmentHasher.inputs[1] <== secret;

    component merkleProof = MerkleProof(levels);
    merkleProof.leaf <== commitmentHasher.out;
    
    component pathNumber = Bits2Num(levels);
    for (var i = 0; i < levels; i++) {
         merkleProof.pathElements[i] <== pathElements[i];
         merkleProof.pathIndices[i] <== pathIndices[i];

         pathNumber.in[i] <== pathIndices[i];
    }

    merkleProof.root === root;

    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== nullifier;
    nullifierHasher.inputs[1] <== levels;

    nullifierHash <== nullifierHasher.out;

    // Squares are used to prevent optimizer from removing those constraints
    signal recipientSquare;
    recipientSquare <== recipient * recipient;
}

component main { public [recipient, root] } = Withdraw(10);