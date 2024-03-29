// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Token is ERC20, ERC20Permit {
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenSupply
    ) ERC20(_tokenName, _tokenSymbol) ERC20Permit(_tokenName) {
        _mint(msg.sender, _tokenSupply);
    }
}
