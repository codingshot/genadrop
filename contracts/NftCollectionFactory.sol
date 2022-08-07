// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC1155/extensions/IERC1155MetadataURI.sol)

pragma solidity ^0.8.0;


import "./NFT.sol";


contract NftCollection{
    // store collection addresses
    mapping(address => address[]) private _collectionAddresses;
    event CollectionCreated(address indexed collectionAddress, address indexed collectionOwner, string collectionName, string collectiondescription);
    
    function createCollection(string memory _name, string memory _symbol, string memory _description) public {
        address collection = address (new NftMinter(_name, _symbol, msg.sender));
        _collectionAddresses[msg.sender].push(collection);
        emit CollectionCreated(collection, msg.sender, _name, _description);
    }
    
    function collectionsOf(address user) public view returns (address[] memory) {
        return _collectionAddresses[user];
    } 
}
