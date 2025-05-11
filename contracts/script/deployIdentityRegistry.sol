// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";
/**
contract DeployIdentityRegistry is Script {
   
    function run() public {
        uint32[17] memory publicInputs = [
            0x0000000000000000000012,
            0x0000000000000000000001,
            0x0000000000111111111111,
            0x0000000000222222222222,
            0x0000000000333333333333,
            0x0000000000444444444444,
            0x0000000000555555555555,
            0x0000000000666666666666,
            0x0000000000777777777777,
            0x0000000000888888888888,
            0x0000000000999999999999,
            0x0000000000aaaaaaaaaaaa,
            0x0000000000bbbbbbbbbbbbb,
            0x0000000000ccccccccccccc,
            0x0000000000ddddddddddddd,
            0x0000000000eeeeeeeeeeeee,
            0x0000000000fffffffffffffff    
        ];

        vm.startBroadcast();
        new IdentityRegistry(publicInputs);
        vm.stopBroadcast();
    }
}
 */