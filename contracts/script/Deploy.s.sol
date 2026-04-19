// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {DAOTimelock} from "../src/DAOTimelock.sol";
import {DAOGovernor} from "../src/DAOGovernor.sol";
import {DAOFactory} from "../src/DAOFactory.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy implementation contracts (not initialized, just bytecode)
        DAOToken tokenImpl = new DAOToken();
        console.log("DAOToken implementation:", address(tokenImpl));

        DAOTimelock timelockImpl = new DAOTimelock();
        console.log("DAOTimelock implementation:", address(timelockImpl));

        DAOGovernor governorImpl = new DAOGovernor();
        console.log("DAOGovernor implementation:", address(governorImpl));

        // Deploy factory
        DAOFactory factory = new DAOFactory(address(tokenImpl), address(timelockImpl), address(governorImpl));
        console.log("DAOFactory:", address(factory));

        vm.stopBroadcast();
    }
}
