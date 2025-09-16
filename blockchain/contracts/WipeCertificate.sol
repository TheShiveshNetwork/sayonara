// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WipeCertificate {
    address public issuer;
    mapping(uint => string) public certificates; // certificateID → hash

    event CertificateIssued(uint indexed id, string hash, address indexed issuer);

    constructor() {
        issuer = msg.sender;
    }

    function issueCertificate(uint id, string memory hash) public {
        require(msg.sender == issuer, "Only issuer can issue");
        certificates[id] = hash;
        emit CertificateIssued(id, hash, issuer);
    }

    function getCertificate(uint id) public view returns (string memory) {
        return certificates[id];
    }
}
