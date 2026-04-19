// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DAOFactory} from "../../src/DAOFactory.sol";
import {DAOToken} from "../../src/DAOToken.sol";
import {DAOTimelock} from "../../src/DAOTimelock.sol";
import {DAOGovernor} from "../../src/DAOGovernor.sol";
import {IDAOFactory} from "../../src/interfaces/IDAOFactory.sol";
import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";

contract GovernanceFlowTest is Test {
    DAOFactory public factory;
    DAOToken public token;
    DAOGovernor public governor;
    DAOTimelock public timelock;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    uint256 constant VOTING_DELAY = 7200; // ~1 day on Base
    uint256 constant VOTING_PERIOD = 50400; // ~7 days on Base
    uint256 constant TIMELOCK_DELAY = 86400; // 1 day

    function setUp() public {
        DAOToken tokenImpl = new DAOToken();
        DAOTimelock timelockImpl = new DAOTimelock();
        DAOGovernor governorImpl = new DAOGovernor();
        factory = new DAOFactory(address(tokenImpl), address(timelockImpl), address(governorImpl));

        address[] memory recipients = new address[](2);
        recipients[0] = alice;
        recipients[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 600_000e18;
        amounts[1] = 400_000e18;

        IDAOFactory.DAOParams memory params = IDAOFactory.DAOParams({
            name: "Governance Test DAO",
            tokenSymbol: "GTDAO",
            tokenRecipients: recipients,
            tokenAmounts: amounts,
            votingDelay: uint48(VOTING_DELAY),
            votingPeriod: uint32(VOTING_PERIOD),
            proposalThreshold: 0,
            quorumNumerator: 4,
            timelockDelay: TIMELOCK_DELAY
        });

        vm.prank(alice);
        (address t, address tl, address g) = factory.createDAO(params);

        token = DAOToken(t);
        timelock = DAOTimelock(payable(tl));
        governor = DAOGovernor(payable(g));

        // Fund the treasury with 10 ETH
        vm.deal(address(timelock), 10 ether);
    }

    function test_fullGovernanceLifecycle() public {
        // --- Step 1: Create a proposal to send 1 ETH to carol ---
        address carol = makeAddr("carol");

        address[] memory targets = new address[](1);
        targets[0] = carol;

        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        string memory description = "Send 1 ETH to Carol for design work";

        vm.prank(alice);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        // Proposal should be in Pending state
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Pending));

        // --- Step 2: Advance past voting delay ---
        vm.roll(block.number + VOTING_DELAY + 1);

        // Proposal should now be Active
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Active));

        // --- Step 3: Vote ---
        // Alice votes For (support = 1)
        vm.prank(alice);
        governor.castVote(proposalId, 1);

        // Bob votes For
        vm.prank(bob);
        governor.castVote(proposalId, 1);

        // --- Step 4: Advance past voting period ---
        vm.roll(block.number + VOTING_PERIOD + 1);

        // Proposal should have Succeeded
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Succeeded));

        // --- Step 5: Queue the proposal ---
        bytes32 descHash = keccak256(bytes(description));
        governor.queue(targets, values, calldatas, descHash);

        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Queued));

        // --- Step 6: Advance past timelock delay ---
        vm.warp(block.timestamp + TIMELOCK_DELAY + 1);

        // --- Step 7: Execute ---
        uint256 carolBalanceBefore = carol.balance;
        governor.execute(targets, values, calldatas, descHash);

        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Executed));
        assertEq(carol.balance, carolBalanceBefore + 1 ether);
        assertEq(address(timelock).balance, 9 ether);
    }

    function test_proposalDefeatedWithoutQuorum() public {
        address[] memory targets = new address[](1);
        targets[0] = makeAddr("target");

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        vm.prank(alice);
        uint256 proposalId = governor.propose(targets, values, calldatas, "Low turnout proposal");

        // Advance to active
        vm.roll(block.number + VOTING_DELAY + 1);

        // Nobody votes. Advance past voting period.
        vm.roll(block.number + VOTING_PERIOD + 1);

        // Should be Defeated (no quorum)
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Defeated));
    }

    function test_proposalDefeatedByAgainstVotes() public {
        address[] memory targets = new address[](1);
        targets[0] = makeAddr("target");

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        vm.prank(alice);
        uint256 proposalId = governor.propose(targets, values, calldatas, "Controversial proposal");

        vm.roll(block.number + VOTING_DELAY + 1);

        // Alice votes Against (support = 0), Bob votes For (support = 1)
        vm.prank(alice);
        governor.castVote(proposalId, 0);

        vm.prank(bob);
        governor.castVote(proposalId, 1);

        vm.roll(block.number + VOTING_PERIOD + 1);

        // Alice has 600k, Bob has 400k -> Against wins
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Defeated));
    }

    function test_treasuryHoldsETH() public view {
        assertEq(address(timelock).balance, 10 ether);
    }
}
