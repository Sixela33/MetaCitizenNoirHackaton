// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IdentityRegistry} from "./IdentityRegistry.sol";

abstract contract Gate is ERC20 {

    IdentityRegistry public identityRegistry;

    constructor(address _identityRegistry) {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }

    function _updateIdentityRegistry(address _identityRegistry) internal {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }

    function _canInteract(address identity) internal view returns (bool) {
        return identityRegistry.canInteract(identity);
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        require(_canInteract(from), "From address cannot interact");
        require(_canInteract(to), "To address cannot interact");

        super._update(from, to, value);
    }
}