// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TimelockControllerUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

/// @title DAOTimelock
/// @notice TimelockController that serves as the DAO treasury. Holds ETH and ERC-20 tokens.
///         Proposals execute through this contract after a configurable delay.
///         Deployed as a minimal proxy via DAOFactory.
contract DAOTimelock is TimelockControllerUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
}
