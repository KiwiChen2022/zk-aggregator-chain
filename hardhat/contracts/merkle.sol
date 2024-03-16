// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MerkleProof {
    error NotOwner();
    error VerificationFailed(); 
    bytes32 public root;
    address public owner;

    event VerifySuccess(bytes32 indexed leaf);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    function setRoot(bytes32 _root) public onlyOwner {
        root = _root;
    }

    function verify(bytes32[] memory proof, bytes32 leaf) public {
        bytes32 hash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            hash = keccak256(abi.encodePacked(hash, proofElement));
        }

        if (hash == root) {
            emit VerifySuccess(leaf);
        } else {
            revert VerificationFailed();
        }
    }
}
