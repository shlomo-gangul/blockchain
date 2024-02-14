import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwapPool Contract", function () {
  let SwapPool: any;
  let swapPool: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let tokenA: any;
  let tokenB: any;

  beforeEach(async function () {
    // Deploy Mock ERC20 Tokens and SwapPool
    const Token = await ethers.getContractFactory("Token");
    tokenA = await Token.deploy("Token A", "TKNA", 1000000);
    tokenB = await Token.deploy("Token B", "TKNB", 1000000);

    console.log("tokenA", tokenA);

    [owner, addr1, addr2] = await ethers.getSigners();

    SwapPool = await ethers.getContractFactory("SwapPool");
    swapPool = await SwapPool.deploy(tokenA.address, tokenB.address);
  });

  describe("Deployment", function () {
    it("Should set the right token addresses", async function () {
      expect(await swapPool.tokenA()).to.equal(tokenA.address);
      expect(await swapPool.tokenB()).to.equal(tokenB.address);
    });
  });

  describe("Deposit", function () {
    it("Should deposit tokens correctly", async function () {
      // You need to approve before depositing
      await tokenA.connect(owner).approve(swapPool.address, 500);
      await tokenB.connect(owner).approve(swapPool.address, 500);

      await swapPool.connect(owner).deposit(500, 500);

      expect(await swapPool.balanceA()).to.equal(500);
      expect(await swapPool.balanceB()).to.equal(500);
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw tokens correctly", async function () {
      // First deposit tokens
      await tokenA.connect(owner).approve(swapPool.address, 500);
      await tokenB.connect(owner).approve(swapPool.address, 500);
      await swapPool.connect(owner).deposit(500, 500);

      // Now withdraw
      await swapPool.connect(owner).withdraw(250, 250);

      expect(await swapPool.balanceA()).to.equal(250);
      expect(await swapPool.balanceB()).to.equal(250);
    });
  });

  describe("Swap", function () {
    it("Should swap tokens correctly", async function () {
      // Assuming addr2 wants to swap 100 TokenA for TokenB
      await tokenA.connect(owner).approve(swapPool.address, 100);

      const initialBalanceTokenBAddr2 = await tokenB.balanceOf(owner.address);

      await swapPool.connect(owner).swap(tokenA.address, tokenB.address, 100);

      const finalBalanceTokenBAddr2 = await tokenB.balanceOf(owner.address);

      expect(finalBalanceTokenBAddr2 > initialBalanceTokenBAddr2);
    });
  });

  // Add more tests for edge cases and error handling
});
