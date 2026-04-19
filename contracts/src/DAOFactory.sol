// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {TimelockControllerUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import {IDAOFactory} from "./interfaces/IDAOFactory.sol";
import {DAOToken} from "./DAOToken.sol";
import {DAOTimelock} from "./DAOTimelock.sol";
import {DAOGovernor} from "./DAOGovernor.sol";

/// @title DAOFactory
/// @notice Permissionless factory that deploys complete DAOs (token + timelock + governor)
///         in a single transaction using EIP-1167 minimal proxies.
contract DAOFactory is IDAOFactory {
    using Clones for address;

    address public immutable tokenImplementation;
    address public immutable timelockImplementation;
    address public immutable governorImplementation;

    uint256 public daoCount;
    mapping(uint256 => DAOInfo) internal _daos;

    constructor(address tokenImpl_, address timelockImpl_, address governorImpl_) {
        require(tokenImpl_ != address(0), "DAOFactory: zero token impl");
        require(timelockImpl_ != address(0), "DAOFactory: zero timelock impl");
        require(governorImpl_ != address(0), "DAOFactory: zero governor impl");

        tokenImplementation = tokenImpl_;
        timelockImplementation = timelockImpl_;
        governorImplementation = governorImpl_;
    }

    /// @inheritdoc IDAOFactory
    function createDAO(DAOParams calldata params) external returns (address token, address timelock, address governor) {
        // Validate inputs
        require(params.tokenRecipients.length == params.tokenAmounts.length, "DAOFactory: length mismatch");
        require(params.tokenRecipients.length > 0, "DAOFactory: no recipients");
        require(params.tokenRecipients.length <= 200, "DAOFactory: too many recipients");
        require(params.quorumNumerator >= 1 && params.quorumNumerator <= 100, "DAOFactory: invalid quorum");
        require(params.votingDelay >= 1, "DAOFactory: voting delay too short");
        require(params.votingPeriod >= 7200, "DAOFactory: voting period too short");
        require(params.timelockDelay >= 3600, "DAOFactory: timelock delay too short");
        require(bytes(params.name).length > 0, "DAOFactory: empty name");

        uint256 daoId = daoCount;
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, daoId));

        // Step 1: Deploy clones
        token = tokenImplementation.cloneDeterministic(keccak256(abi.encodePacked(salt, "token")));
        timelock = timelockImplementation.cloneDeterministic(keccak256(abi.encodePacked(salt, "timelock")));
        governor = governorImplementation.cloneDeterministic(keccak256(abi.encodePacked(salt, "governor")));

        // Step 2: Initialize token (mint + auto-delegate)
        DAOToken(token).initialize(params.name, params.tokenSymbol, params.tokenRecipients, params.tokenAmounts);

        // Step 3: Initialize timelock (proposer=governor, executor=anyone, admin=none; timelock self-administers)
        address[] memory proposers = new address[](1);
        proposers[0] = governor;
        address[] memory executors = new address[](1);
        executors[0] = address(0); // anyone can execute
        DAOTimelock(payable(timelock)).initialize(params.timelockDelay, proposers, executors, address(0));

        // Step 4: Initialize governor
        DAOGovernor(payable(governor)).initialize(
            params.name,
            IVotes(token),
            TimelockControllerUpgradeable(payable(timelock)),
            params.votingDelay,
            params.votingPeriod,
            params.proposalThreshold,
            params.quorumNumerator
        );

        // Step 5: Register DAO
        _daos[daoId] = DAOInfo({
            name: params.name,
            token: token,
            timelock: timelock,
            governor: governor,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        daoCount = daoId + 1;

        emit DAOCreated(daoId, token, governor, timelock, msg.sender, params.name);
    }

    /// @inheritdoc IDAOFactory
    function daos(uint256 daoId)
        external
        view
        returns (string memory name, address token, address timelock, address governor, address creator, uint256 createdAt)
    {
        DAOInfo storage info = _daos[daoId];
        return (info.name, info.token, info.timelock, info.governor, info.creator, info.createdAt);
    }

    /// @notice Predict the addresses of a DAO's contracts before deployment.
    /// @param deployer The address that will call createDAO
    /// @param daoId The DAO ID (use current daoCount for next deployment)
    function predictAddresses(address deployer, uint256 daoId)
        external
        view
        returns (address token, address timelock, address governor)
    {
        bytes32 salt = keccak256(abi.encodePacked(deployer, daoId));
        token = tokenImplementation.predictDeterministicAddress(keccak256(abi.encodePacked(salt, "token")));
        timelock = timelockImplementation.predictDeterministicAddress(keccak256(abi.encodePacked(salt, "timelock")));
        governor = governorImplementation.predictDeterministicAddress(keccak256(abi.encodePacked(salt, "governor")));
    }
}
