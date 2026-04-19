// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";

/// @title DAOToken
/// @notice ERC20 governance token with fixed supply, voting power, and gasless approvals.
///         Deployed as a minimal proxy via DAOFactory.
contract DAOToken is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the token with a fixed supply distributed to recipients.
    ///         Each recipient is auto-delegated to themselves so voting power is active immediately.
    /// @param name_ Token name (also used for EIP-2612 permit domain)
    /// @param symbol_ Token symbol
    /// @param recipients Addresses to receive initial tokens
    /// @param amounts Corresponding token amounts (18 decimals)
    function initialize(
        string memory name_,
        string memory symbol_,
        address[] memory recipients,
        uint256[] memory amounts
    ) external initializer {
        require(recipients.length == amounts.length, "DAOToken: length mismatch");
        require(recipients.length > 0, "DAOToken: no recipients");

        __ERC20_init(name_, symbol_);
        __ERC20Permit_init(name_);
        __ERC20Votes_init();

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "DAOToken: zero address");
            require(amounts[i] > 0, "DAOToken: zero amount");
            _mint(recipients[i], amounts[i]);
            _delegate(recipients[i], recipients[i]);
        }
    }

    // --- Required overrides for diamond inheritance ---

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
