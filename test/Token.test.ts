import { expect } from "chai";
import { BaseContract } from "ethers";
import { ethers } from "hardhat";

describe("SwapPool Contract", function () {
  let SwapPool: any;
  let swapPool: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let spaceToken: any;
  let timeToken: any;

  beforeEach(async function () {
    // Deploy Mock ERC20 Tokens and SwapPool
    const Token = await ethers.getContractFactory("Token");
    spaceToken = await Token.deploy("Space", "SPC", BigInt(1000000e18));
    timeToken = await Token.deploy("Time", "TME", BigInt(1000000e18));

    [owner, addr1, addr2] = await ethers.getSigners();

    SwapPool = await ethers.getContractFactory("SwapPool");
    swapPool = await SwapPool.deploy(
      await spaceToken.getAddress(),
      await timeToken.getAddress()
    );
  });

  // describe("Deployment", function () {
  //   it("Should set the right token addresses", async function () {
  //     expect(await swapPool.tokenA()).to.equal(await spaceToken.getAddress());
  //     expect(await swapPool.tokenB()).to.equal(await timeToken.getAddress());
  //   });
  // });

  // describe("Deposit", function () {
  //   it("Should deposit tokens correctly", async function () {

  //     const poolAddress = await swapPool.getAddress();

  //     // You need to approve before depositing
  //     await spaceToken.connect(owner).approve(poolAddress, 500);
  //     await timeToken.connect(owner).approve(poolAddress, 500);

  //     await swapPool.connect(owner).deposit(500, 500);

  //     expect(await swapPool.balanceA()).to.equal(500);
  //     expect(await swapPool.balanceB()).to.equal(500);
  //   });
  // });

  // describe("Withdraw", function () {
  //   it("Should withdraw tokens correctly", async function () {

  //     const poolAddress = await swapPool.getAddress();

  //     // First deposit tokens
  //     await spaceToken.connect(owner).approve(poolAddress, 500);
  //     await timeToken.connect(owner).approve(poolAddress, 500);
  //     await swapPool.connect(owner).deposit(500, 500);

  //     // Now withdraw
  //     await swapPool.connect(owner).withdraw(250, 250);

  //     expect(await swapPool.balanceA()).to.equal(250);
  //     expect(await swapPool.balanceB()).to.equal(250);
  //   });
  // });

  // describe("Swap", function () {
  //   it("Should swap tokens correctly", async function () {
  //     const poolAddress = await swapPool.getAddress();

  //     const timeTokenAddress = await timeToken.getAddress();

  //     const spaceTokenAddress = await spaceToken.getAddress();

  //     // First deposit tokens
  //     await spaceToken.connect(owner).approve(poolAddress, 500);
  //     await timeToken.connect(owner).approve(poolAddress, 500);
  //     await swapPool.connect(owner).deposit(500, 500);

  //     // Assuming addr2 wants to swap 100 TokenA for TokenB
  //     await spaceToken.connect(owner).approve(poolAddress, 100);

  //     const initialBalanceTokenBAddr2 = await timeToken.balanceOf(owner.address);

  //     await swapPool.connect(owner).swap(spaceTokenAddress, timeTokenAddress, 100);

  //     const finalBalanceTokenBAddr2 = await timeToken.balanceOf(owner.address);

  //     expect(finalBalanceTokenBAddr2 > initialBalanceTokenBAddr2);
  //   });
  // });

  describe("Compare", function () {
    async function performSwapAndLogDetails(tokenA: any, tokenB: any, addr: any, pool: any, amount: any) {
      await tokenA.connect(addr).approve(pool.getAddress(), BigInt(amount));
      await pool.connect(addr).swap(tokenA.getAddress(), tokenB.getAddress(), BigInt(amount));
      console.log("TME:", await tokenA.balanceOf(addr.address));
      console.log("SPC:", await tokenB.balanceOf(addr.address));
      console.log("balance A:", await pool.balanceA());
      console.log("balance B:", await pool.balanceB());
      console.log("price A:", BigInt(await pool.priceA()));
      console.log("price B:", BigInt(await pool.priceB()));
      return { priceA: await pool.priceA(), priceB: await pool.priceB() };
    }

    it("Should swap form TME to SPC and show the difference", async function () {
      const poolAddress = await swapPool.getAddress();
      const priceChanges = [];

      // First deposit tokens
      await spaceToken.connect(owner).approve(poolAddress, BigInt(10e18));
      await timeToken.connect(owner).approve(poolAddress, BigInt(10e18));
      await swapPool.connect(owner).deposit(BigInt(10e18), BigInt(10e18));
      await timeToken.connect(owner).transfer(addr1.address, BigInt(5e18));

      // Perform swaps and log details
      for (let i = 0; i < 3; i++) {
        const prices = await performSwapAndLogDetails(timeToken, spaceToken, addr1, swapPool, 1e18);
        priceChanges.push(prices);
      }

      console.log("tokenA:+,tokenB:*");
      for (let i = 0; i < priceChanges.length; i++) {
        console.log(`${"*".repeat(priceChanges[i].priceA.toString() + 1)}`);
        console.log(`${"+".repeat(priceChanges[i].priceB.toString() + 1)}`);
      }
      console.log("______________________________________________________________");

      expect(priceChanges[priceChanges.length - 1].priceA > priceChanges[priceChanges.length - 1].priceB);
    });
  });
  // Add more tests for edge cases and error handling
});
