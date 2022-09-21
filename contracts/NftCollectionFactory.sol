// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC1155/extensions/IERC1155MetadataURI.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface CollectionInterface {
  function initialize(string memory name_, string memory symbol_, address deployer) external;
}


contract NftCollection is Initializable, UUPSUpgradeable{

    address public TokenImplementation;
    address private owner;
    // store collection addresses
    mapping(address => address[]) private _collectionAddresses;
    event CollectionCreated(address indexed collectionAddress, address indexed collectionOwner, string collectionName, string collectiondescription);
    

    function initialize(address token) initializer public{
        require(token != address(0), "ZeroAddress");
        TokenImplementation = token;
        owner = msg.sender;
    }

    function _authorizeUpgrade(address newImplementation) internal view override{
        // can add required upgrade access control here
        require(msg.sender == owner, "UnAuthorized");
    }
    function createCollection(string memory _name, string memory _symbol, string memory _description) public {
        address collection = ClonesUpgradeable.clone(TokenImplementation);
        CollectionInterface(collection).initialize(_name, _symbol, msg.sender);
        // address collection = address (new NftMinter(_name, _symbol, msg.sender));
        _collectionAddresses[msg.sender].push(collection);
        emit CollectionCreated(collection, msg.sender, _name, _description);
    }
    
    function collectionsOf(address user) public view returns (address[] memory) {
        return _collectionAddresses[user];
    } 
}
