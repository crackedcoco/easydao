// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract DAOTokenTest is Test {
    DAOToken public implementation;
    DAOToken public token;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        implementation = new DAOToken();

        address clone = Clones.clone(address(implementation));
        token = DAOToken(clone);

        address[] memory recipients = new address[](2);
        recipients[0] = alice;
        recipients[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 700_000e18;
        amounts[1] = 300_000e18;

        token.initialize("Test Token", "TEST", recipients, amounts);
    }

    function test_nameAndSymbol() public view {
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
    }

    function test_initialDistribution() public view {
        assertEq(token.balanceOf(alice), 700_000e18);
        assertEq(token.balanceOf(bob), 300_000e18);
        assertEq(token.totalSupply(), 1_000_000e18);
    }

    function test_autoDelegate() public view {
        assertEq(token.getVotes(alice), 700_000e18);
        assertEq(token.getVotes(bob), 300_000e18);
    }

    function test_cannotReinitialize() public {
        address[] memory r = new address[](1);
        r[0] = alice;
        uint256[] memory a = new uint256[](1);
        a[0] = 100e18;

        vm.expectRevert();
        token.initialize("X", "X", r, a);
    }

    function test_cannotInitializeImplementation() public {
        address[] memory r = new address[](1);
        r[0] = alice;
        uint256[] memory a = new uint256[](1);
        a[0] = 100e18;

        vm.expectRevert();
        implementation.initialize("X", "X", r, a);
    }

    function test_revertOnLengthMismatch() public {
        address clone = Clones.clone(address(implementation));
        DAOToken t = DAOToken(clone);

        address[] memory r = new address[](2);
        r[0] = alice;
        r[1] = bob;
        uint256[] memory a = new uint256[](1);
        a[0] = 100e18;

        vm.expectRevert("DAOToken: length mismatch");
        t.initialize("X", "X", r, a);
    }

    function test_revertOnNoRecipients() public {
        address clone = Clones.clone(address(implementation));
        DAOToken t = DAOToken(clone);

        address[] memory r = new address[](0);
        uint256[] memory a = new uint256[](0);

        vm.expectRevert("DAOToken: no recipients");
        t.initialize("X", "X", r, a);
    }

    function test_transfer() public {
        vm.prank(alice);
        token.transfer(bob, 100e18);

        assertEq(token.balanceOf(alice), 699_900e18);
        assertEq(token.balanceOf(bob), 300_100e18);
    }

    function test_votingPowerUpdatesOnTransfer() public {
        vm.prank(alice);
        token.transfer(bob, 100_000e18);

        assertEq(token.getVotes(alice), 600_000e18);
        assertEq(token.getVotes(bob), 400_000e18);
    }
}
