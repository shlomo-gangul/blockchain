// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {GameFactory} from "../contracts/GameFactory.sol";
import {DellemaGame} from "../contracts/DillemaGame.sol";

contract GameFactoryTest is Test {
    function setUp() external {
        factory = new GameFactory();
        game = new DilemaGame();
    }

    function testCreateNewGame() public {
        factory.createNewGame();
        assertEq(factory.gameCount(), 1);
    }
}
