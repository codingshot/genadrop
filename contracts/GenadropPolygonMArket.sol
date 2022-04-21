// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // security for non-reentrant
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


interface customIERC1155 {
    function uri(uint id) external view returns (string memory);
}

contract NFTMarket is ReentrancyGuard, EIP712 {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; // Id for each individual item
    Counters.Counter private _itemsSold; // Number of items sold

    address payable owner; // The owner of the NFTMarket contract (transfer and send function availabe to payable addresses)


    constructor(string memory name) EIP712(name, "1.0.0") {
        owner = payable(msg.sender);
    }


    // Event is an inhertable contract that can be used to emit events
    event BulkMarketItemCreated(
        address indexed nftContract,
        address indexed seller,
        string category,
        uint256 price,
        bool isSingle,
        uint256 itemId,
        uint256[] tokenId,
        bool isSold,
        address payable owner,
        uint256 chain
    );

    event MarketItemCreated(
        address indexed nftContract,
        address indexed seller,
        string category,
        uint256 price,
        bool isSingle,
        uint256 itemId,
        uint256 tokenId,
        bool isSold,
        address payable owner,
        uint256 chain
    );

    event MarketItemSold(
        address indexed nftContract,
        address indexed seller,
        uint256 price,
        uint256 itemId,
        uint256 tokenId
    );

    function getTokenUri(address nftContract, uint tokenId) public view returns (string memory) {
        return customIERC1155(nftContract).uri(tokenId);
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender == owner, "only owner");
        require(_newOwner != address(0), "No zero Admin");
        owner = payable (_newOwner);
    }


    function createBulkMarketItem(
        address nftContract,
        uint256[] memory tokenIds,
        uint256 price,
        uint256[] memory amounts,
        string calldata category,
        address seller
    ) public payable nonReentrant {
        require(price > 0, "No item for free here");
        require(tokenIds.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        uint256 currentId = _itemIds.current();
        
        IERC1155(nftContract).safeBatchTransferFrom(seller, address(this), tokenIds, amounts, '');

        emit BulkMarketItemCreated(
            nftContract,
            seller,
            category,
            price,
            false,
            currentId,
            tokenIds,
            false,
            payable(address(0)),
            block.chainid
        );
    }

    function createMarketplaceItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string calldata category,
        address seller
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        IERC1155(nftContract).safeTransferFrom(seller, address(this), tokenId, 1, '');

        emit MarketItemCreated(
            nftContract,
            seller,
            category,
            price,
            true,
            itemId,
            tokenId,
            false,
            payable(address(0)),
            block.chainid
        );
    }

    function _hash(address account, uint256 tokenId, uint256 price, address seller, address nftContract)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFT(uint256 tokenId,address account)"),
            tokenId,
            account,
            price,
            seller,
            nftContract
        )));
    }

    function _verify(bytes32 digest, bytes memory signature)
    internal view returns (bool)
    {
        return (ECDSA.recover(digest, signature) == owner);
    }

    function nftSale(uint256 itemId, uint256 price, uint256 tokenId, address seller, address nftContract, bytes calldata signature)
        public
        payable
        nonReentrant
    {
        require(_verify(_hash(msg.sender, tokenId, price, seller, nftContract), signature), "Invalid signature");
        require(
            msg.value == price,
            "Please make the price to be same as listing price"
        );
        uint256 fee = price * 10 / 100;
        
        payable(seller).transfer(msg.value-fee);
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, 1, '');
        //idToMarketItem[itemId].isSold = true;
        //idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();

        emit MarketItemSold(
            nftContract,
            seller,
            price,
            itemId,
            tokenId
        );

    }

    function withdraw() external {
        owner.transfer(address(this).balance);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}