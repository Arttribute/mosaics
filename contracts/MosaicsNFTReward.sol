// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MosaicsNFTReward is ERC721URIStorage {
    uint256 private _tokenIdCounter = 0;

    constructor() ERC721("Mosaic", "MSC") {}

    function mint(address recipient, string memory tokenUri) public returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenUri);
        _tokenIdCounter += 1;
        return newTokenId;
    }

    function mintBatch(address[] memory recipients, string[] memory tokenUris) public returns (uint256[] memory) {
        require(recipients.length > 0, "Recipients array is empty");
        require(recipients.length == tokenUris.length, "Recipients and tokenUris arrays length mismatch");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 newTokenId = _tokenIdCounter;
            _safeMint(recipients[i], newTokenId);
            _setTokenURI(newTokenId, tokenUris[i]);
            tokenIds[i] = newTokenId;
            _tokenIdCounter += 1;
        }
        return tokenIds;
    }
}
