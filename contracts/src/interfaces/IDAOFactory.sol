// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDAOFactory {
    struct DAOParams {
        string name;
        string tokenSymbol;
        address[] tokenRecipients;
        uint256[] tokenAmounts;
        uint48 votingDelay;
        uint32 votingPeriod;
        uint256 proposalThreshold;
        uint256 quorumNumerator;
        uint256 timelockDelay;
    }

    struct DAOInfo {
        string name;
        address token;
        address timelock;
        address governor;
        address creator;
        uint256 createdAt;
    }

    event DAOCreated(
        uint256 indexed daoId,
        address indexed token,
        address indexed governor,
        address timelock,
        address creator,
        string name
    );

    function createDAO(DAOParams calldata params) external returns (address token, address timelock, address governor);
    function daoCount() external view returns (uint256);
    function daos(uint256 daoId) external view returns (string memory name, address token, address timelock, address governor, address creator, uint256 createdAt);
}
