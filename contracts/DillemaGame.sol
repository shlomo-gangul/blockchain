// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DillemaGame is {
    address public player1;
    address public player2;

    uint256 public player1Choice;
    uint256 public player2Choice;

    uint256 public player1Deposit;
    uint256 public player2Deposit;

    

    bool public player1ChoiceCommitted;
    bool public player2ChoiceCommitted;

    bool public player1DepositCommitted;
    bool public player2DepositCommitted;

    constructor() {
        player1 = msg.sender;
        player2= address(0);
    }
}
