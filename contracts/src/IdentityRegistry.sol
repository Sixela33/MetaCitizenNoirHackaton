// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {HonkVerifier} from "./Verifier.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityRegistry is Ownable {

    struct Identity {
        uint256 expiration;
    }

    HonkVerifier public verifier;
    bytes32[] public publicInputs;

    mapping(bytes32 => bool) public nullifiers;
    mapping(address => Identity) public identities;

    error InvalidProof();
    error ProofAlreadyUsed();

    event IdentityRegistered(
        address indexed user,
        uint256 expiration,
        bytes32 nullifier
    );

    constructor(
        bytes32[] memory _publicInputs,
        address _verifier
    ) Ownable(msg.sender) {
        if (_verifier == address(0)) {
            verifier = new HonkVerifier();
        } else {
            _updateVerifier(_verifier);
        }
        publicInputs = _publicInputs;
    }

    function _updateVerifier(address _verifier) internal onlyOwner {
        verifier = HonkVerifier(_verifier);
    }

    function registerIdentity(bytes calldata proof) public {
        bytes32 nullifier = keccak256(abi.encodePacked(proof));
        
        if (nullifiers[nullifier]) {
            revert ProofAlreadyUsed();
        }
        
        if (!verifier.verify(proof, publicInputs)) {
            revert InvalidProof();
        }

        nullifiers[nullifier] = true;
        identities[msg.sender] = Identity(block.timestamp + 1 days); // 1 days
        emit IdentityRegistered(msg.sender, (block.timestamp + 1 days), nullifier);
    }

    function canInteract(address identity) public view returns (bool) {
        return identities[identity].expiration > block.timestamp;
    }
}

