// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DAOFactory} from "../src/DAOFactory.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {DAOTimelock} from "../src/DAOTimelock.sol";
import {DAOGovernor} from "../src/DAOGovernor.sol";
import {IDAOFactory} from "../src/interfaces/IDAOFactory.sol";

contract DAOFactoryTest is Test {
    DAOFactory public factory;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public carol = makeAddr("carol");

    function setUp() public {
        DAOToken tokenImpl = new DAOToken();
        DAOTimelock timelockImpl = new DAOTimelock();
        DAOGovernor governorImpl = new DAOGovernor();

        factory = new DAOFactory(address(tokenImpl), address(timelockImpl), address(governorImpl));
    }

    function _defaultParams() internal view returns (IDAOFactory.DAOParams memory) {
        address[] memory recipients = new address[](2);
        recipients[0] = alice;
        recipients[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 600_000e18;
        amounts[1] = 400_000e18;

        return IDAOFactory.DAOParams({
            name: "Test DAO",
            tokenSymbol: "TDAO",
            tokenRecipients: recipients,
            tokenAmounts: amounts,
            votingDelay: 7200,
            votingPeriod: 50400,
            proposalThreshold: 0,
            quorumNumerator: 4,
            timelockDelay: 86400
        });
    }

    function test_createDAO() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (address token, address timelock, address governor) = factory.createDAO(params);

        assertTrue(token != address(0));
        assertTrue(timelock != address(0));
        assertTrue(governor != address(0));
        assertEq(factory.daoCount(), 1);
    }

    function test_tokenSetupCorrectly() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (address token,,) = factory.createDAO(params);

        DAOToken t = DAOToken(token);
        assertEq(t.name(), "Test DAO");
        assertEq(t.symbol(), "TDAO");
        assertEq(t.totalSupply(), 1_000_000e18);
        assertEq(t.balanceOf(alice), 600_000e18);
        assertEq(t.balanceOf(bob), 400_000e18);
        // Auto-delegated
        assertEq(t.getVotes(alice), 600_000e18);
        assertEq(t.getVotes(bob), 400_000e18);
    }

    function test_governorSetupCorrectly() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (,, address governor) = factory.createDAO(params);

        DAOGovernor g = DAOGovernor(payable(governor));
        assertEq(g.name(), "Test DAO");
        assertEq(g.votingDelay(), 7200);
        assertEq(g.votingPeriod(), 50400);
        assertEq(g.proposalThreshold(), 0);
    }

    function test_daoRegisteredCorrectly() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (address token, address timelock, address governor) = factory.createDAO(params);

        (string memory name, address t, address tl, address g, address creator, uint256 createdAt) = factory.daos(0);
        assertEq(name, "Test DAO");
        assertEq(t, token);
        assertEq(tl, timelock);
        assertEq(g, governor);
        assertEq(creator, alice);
        assertTrue(createdAt > 0);
    }

    function test_predictAddresses() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        (address predToken, address predTimelock, address predGovernor) = factory.predictAddresses(alice, 0);

        vm.prank(alice);
        (address token, address timelock, address governor) = factory.createDAO(params);

        assertEq(predToken, token);
        assertEq(predTimelock, timelock);
        assertEq(predGovernor, governor);
    }

    function test_multipleDAOs() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        factory.createDAO(params);

        params.name = "Second DAO";
        params.tokenSymbol = "DAO2";

        vm.prank(bob);
        factory.createDAO(params);

        assertEq(factory.daoCount(), 2);
    }

    function test_revertOnEmptyName() public {
        IDAOFactory.DAOParams memory params = _defaultParams();
        params.name = "";

        vm.expectRevert("DAOFactory: empty name");
        factory.createDAO(params);
    }

    function test_revertOnInvalidQuorum() public {
        IDAOFactory.DAOParams memory params = _defaultParams();
        params.quorumNumerator = 0;

        vm.expectRevert("DAOFactory: invalid quorum");
        factory.createDAO(params);

        params.quorumNumerator = 101;
        vm.expectRevert("DAOFactory: invalid quorum");
        factory.createDAO(params);
    }

    function test_revertOnShortVotingPeriod() public {
        IDAOFactory.DAOParams memory params = _defaultParams();
        params.votingPeriod = 100;

        vm.expectRevert("DAOFactory: voting period too short");
        factory.createDAO(params);
    }

    function test_revertOnShortVotingDelay() public {
        IDAOFactory.DAOParams memory params = _defaultParams();
        params.votingDelay = 0;

        vm.expectRevert("DAOFactory: voting delay too short");
        factory.createDAO(params);
    }

    function test_revertOnShortTimelockDelay() public {
        IDAOFactory.DAOParams memory params = _defaultParams();
        params.timelockDelay = 0;

        vm.expectRevert("DAOFactory: timelock delay too short");
        factory.createDAO(params);
    }

    function test_revertOnTooManyRecipients() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        address[] memory recipients = new address[](201);
        uint256[] memory amounts = new uint256[](201);
        for (uint256 i = 0; i < 201; i++) {
            recipients[i] = address(uint160(i + 1));
            amounts[i] = 1e18;
        }
        params.tokenRecipients = recipients;
        params.tokenAmounts = amounts;

        vm.expectRevert("DAOFactory: too many recipients");
        factory.createDAO(params);
    }

    function test_timelockRolesSetCorrectly() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (, address timelock, address governor) = factory.createDAO(params);

        DAOTimelock tl = DAOTimelock(payable(timelock));
        assertTrue(tl.hasRole(tl.PROPOSER_ROLE(), governor));
        assertTrue(tl.hasRole(tl.CANCELLER_ROLE(), governor));
        assertTrue(tl.hasRole(tl.EXECUTOR_ROLE(), address(0)));
        assertFalse(tl.hasRole(tl.DEFAULT_ADMIN_ROLE(), alice));
    }

    function test_sameSenderCreatesMultipleDAOs() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        vm.prank(alice);
        (address token1,, address governor1) = factory.createDAO(params);

        params.name = "Second DAO";
        params.tokenSymbol = "DAO2";

        vm.prank(alice);
        (address token2,, address governor2) = factory.createDAO(params);

        assertTrue(token1 != token2);
        assertTrue(governor1 != governor2);
        assertEq(factory.daoCount(), 2);
    }

    function test_emitsDAOCreatedEvent() public {
        IDAOFactory.DAOParams memory params = _defaultParams();

        (address predToken, address predTimelock, address predGovernor) = factory.predictAddresses(alice, 0);

        vm.expectEmit(true, true, true, true);
        emit IDAOFactory.DAOCreated(0, predToken, predGovernor, predTimelock, alice, "Test DAO");

        vm.prank(alice);
        factory.createDAO(params);
    }
}
