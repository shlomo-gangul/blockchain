// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DillemaGame} from "../contracts/DilemaGame.sol";

contract DillemaGameTest is Test {
    DillemaGame game;

    function beforeEach() public {
        game = new DillemaGame();
    }

    function testCreateNewGame() public {
        game.createNewGame();
        assertEq(game.gameCount(), 1);
    }
}
