// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SwapPool {
    address public tokenA;

    address public tokenB;

    uint256 public balanceA;

    uint256 public balanceB;

    uint256 public priceA;

    uint256 public priceB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    //deposit
    function deposit(uint256 amountA, uint256 amountB) external {
        ERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        ERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        balanceA += amountA;
        balanceB += amountB;
        priceChange();
    }

    //wirthdraw
    function withdraw(uint256 amountA, uint256 amountB) external {
        ERC20(tokenA).transfer(msg.sender, amountA);
        ERC20(tokenB).transfer(msg.sender, amountB);

        balanceA -= amountA;
        balanceB -= amountB;
        priceChange();
    }

    //swap
    function swap(
        address fromToken,
        address toToken,
        uint256 amountIn
    ) external {
        priceChange();

        uint256 outAmount = fromToken == tokenA
            ? amountIn * priceA
            : amountIn * priceB;

        ERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);
        ERC20(toToken).transfer(msg.sender, outAmount);
        fromToken == tokenA ? balanceA += amountIn : balanceA -= outAmount;
        fromToken == tokenB ? balanceB += amountIn : balanceB -= outAmount;
    }

    function priceChange() internal {
        priceA = balanceA / balanceB;
        priceB = balanceB / balanceA;
    }
}
