// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol"; // security for non-reentrant
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


interface customIERC1155 {
    function uri(uint id) external view returns (string memory);
    function name() external view returns (string memory);
    function owner() external view returns (address);
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address, uint256);
}

contract NFTMarket is UUPSUpgradeable, ReentrancyGuardUpgradeable, EIP712Upgradeable  {
    uint256 public _itemsSold; // Number of items sold

    address payable owner; // The owner of the NFTMarket contract (transfer and send function availabe to payable addresses)


    // constructor(string memory name) {
        
    //     owner = payable(msg.sender);
    // }

    function initialize(string memory name ) initializer public{
        __EIP712_init_unchained(name, "1.0.0");
        owner = payable(msg.sender);
    }


    // Event is an inhertable contract that can be used to emit events
    event BulkMarketItemCreated(
        address indexed nftContract,
        address indexed seller,
        string category,
        uint256 price,
        uint256[] tokenId,
        address payable owner,
        uint256 chain,
        string description
    );

    event MarketItemCreated(
        address indexed nftContract,
        address indexed seller,
        string category,
        uint256 price,
        uint256 tokenId,
        address payable owner,
        uint256 chain
    );

    event MarketItemSold(
        address indexed nftContract,
        address indexed seller,
        uint256 price,
        uint256 tokenId
    );

    event RecievedRoyalties(address indexed creator, address indexed buyer, uint256 indexed amount);

    function _authorizeUpgrade(address newImplementation) internal view override{
        // can add required upgrade access control here
        require(msg.sender == owner, "UnAuthorized");
    }

    function getTokenUri(address nftContract, uint tokenId) public view returns (string memory) {
        return customIERC1155(nftContract).uri(tokenId);
    }

    function getName(address nftContract) public view returns (string memory) {
        return customIERC1155(nftContract).name();
    }

    function getOwner(address nftContract) public view returns (address) {
        return customIERC1155(nftContract).owner();
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
        address seller,
        string calldata description
    ) public payable nonReentrant {
        require(price > 0, "No item for free here");
        require(tokenIds.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        
        IERC1155Upgradeable(nftContract).safeBatchTransferFrom(seller, address(this), tokenIds, amounts, '');
        emit BulkMarketItemCreated(
            nftContract,
            seller,
            category,
            price,
            tokenIds,
            payable(address(0)),
            block.chainid,
            description
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

        IERC1155Upgradeable(nftContract).safeTransferFrom(seller, address(this), tokenId, 1, '');

        emit MarketItemCreated(
            nftContract,
            seller,
            category,
            price,
            tokenId,
            payable(address(0)),
            block.chainid
        );
    }

    function _hash(address account, uint256 tokenId, uint256 price, address seller, address nftContract)
    internal view returns (bytes32)
    {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFT(uint256 tokenId,address account,uint256 price,address seller,address nftContract)"),
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
        return (ECDSAUpgradeable.recover(digest, signature) == owner);
    }

    function nftSale(uint256 price, uint256 tokenId, address seller, address nftContract, bytes calldata signature)
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
        // get the royalty fee for this nft(the price passed has the market tax deducted)
        uint256 royalty_deductable_fee = msg.value-fee;
        (address receiver, uint256 amount)= customIERC1155(nftContract).royaltyInfo(tokenId, royalty_deductable_fee);

        // should do a require royalty amount <  price


        if (receiver != address(0)) {
            payable(receiver).transfer(amount);
            emit RecievedRoyalties(receiver, seller, amount);
        }
        payable(seller).transfer(royalty_deductable_fee - amount);
        // transfer royalty and emit event
        
        IERC1155Upgradeable(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, 1, '');
        //idToMarketItem[itemId].isSold = true;
        //idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold += 1;

        emit MarketItemSold(
            nftContract,
            seller,
            price,
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