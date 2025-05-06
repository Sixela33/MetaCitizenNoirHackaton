// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {GatedToken} from "../src/GatedToken.sol";

contract DeployGatedToken is Script {
    address identityRegistryAddress = 0x0000000000000000000000000000000000000000;

    function run() public {
        vm.startBroadcast();
        new GatedToken(msg.sender, identityRegistryAddress);
        vm.stopBroadcast();
    }
}