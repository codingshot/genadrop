// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "forge-std/Test.sol";
import "../../contracts/SinglesNft.sol";

contract NftTest is Test {
    using stdStorage for StdStorage;

    SingleNftMinter private nft;

    function setUp() public {
        // Deploy NFT contract
        nft = new SingleNftMinter();
        nft.initialize("ParaSingles", "PRS", address(1));
    }

    // test that params like name and symbol is set
    function testParamsSet() public {
        assertEq(nft.name(), "Para");
        assertEq(nft.symbol(), "PRR");
    }

    function testMint() public {
        // change to deployer address
        vm.prank(address(1));
        nft.mint(address(1), 2, 1, "https://go.com", "0x");
        assertEq(nft.uri(2), "https://go.com");
    }

    function testAssertUri() public {
        // change to deployer address
        vm.prank(address(1));
        nft.mint(address(1), 2, 1, "https://go.com", "0x");
        assertEq(nft.uri(2), "https://go.com");
    }

    // test that the user balance increases after
    function testUserBalanceIncrease() public {
        uint256 slotBalance = stdstore.target(address(nft)).sig(nft.balanceOf.selector).with_key(address(1)).with_key(2).find();
        // change to deployer address
        vm.prank(address(1));
        nft.mint(address(1), 2, 1, "https://go.com", "0x");
        uint256 balanceAfterMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );
        assertEq(balanceAfterMint, 1);
    }


    function testFailMint() public {
        // change to deployer address
        // vm.prank(address(1));
        nft.mint(address(1), 2, 1, "https://go.com", "0x");
    }
}


contract Receiver is ERC1155Receiver {
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}