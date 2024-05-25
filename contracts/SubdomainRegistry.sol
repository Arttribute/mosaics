// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENSRegistry.sol";
import '@ensdomains/ens-contracts/contracts/reverseRegistrar/ReverseRegistrar.sol';
import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrarImplementation.sol";

contract SubdomainRegistrar {
    ENS public ens;
    bytes32 public rootNode;

    constructor(ENS _ens, bytes32 _rootNode) {
        ens = _ens;
        rootNode = _rootNode;
    }

    function registerSubdomain(string memory subdomain) public {
        bytes32 subdomainLabel = keccak256(abi.encodePacked(subdomain));
        bytes32 subdomainNode = keccak256(abi.encodePacked(rootNode, subdomainLabel));

        // Ensure the subdomain doesn't already exist
        require(ens.owner(subdomainNode) == address(0), "Subdomain already exists");

        // Set the owner of the subdomain to the message sender
        ens.setSubnodeOwner(rootNode, subdomainLabel, msg.sender);
    }
}
