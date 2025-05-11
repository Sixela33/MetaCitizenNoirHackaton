// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Gate} from "./Gate.sol";

contract GatedToken is ERC20, Ownable, ERC20Permit, Gate {
    constructor(
        address initialOwner,
        address _identityRegistry
    )
        Gate(_identityRegistry)
        ERC20("GatedToken", "GT")
        Ownable(initialOwner)
        ERC20Permit("GatedToken")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, Gate) {
        super._update(from, to, value);
    }
}