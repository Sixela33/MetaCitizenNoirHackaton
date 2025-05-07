// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {HonkVerifier} from "./Verifier.sol";

contract IdentityRegistry {

    HonkVerifier public verifier;
    bytes32[] public publicInputs;

    struct Identity {
        uint256 expiration;
    }

    mapping(address => Identity) public identities;

    constructor(
        bytes32[] memory _publicInputs,
        address _verifier
    ) {
        if (_verifier == address(0)) {
            verifier = new HonkVerifier();
        } else {
            _updateVerifier(_verifier);
        }
        publicInputs = _publicInputs;
    }

    function _updateVerifier(address _verifier) internal {
        verifier = HonkVerifier(_verifier);
    }

    function registerIdentity(bytes calldata proof) public {
        if (!verifier.verify(proof, publicInputs)) {
            revert("Proof is invalid");
        }
        identities[msg.sender] = Identity(block.timestamp + 1 days); // 1 days
    }

    function canInteract(address identity) public view returns (bool) {
        if (identities[identity].expiration > block.timestamp) {
            return true;
        }
        return false;
    }
}

