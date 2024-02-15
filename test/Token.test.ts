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
    it("Should compare the price of the tokens in the pool", async function () {
      const poolAddress = await swapPool.getAddress();
      const priceChangesA = [];
      const priceChangesB = [];
      // First deposit tokens
      await spaceToken.connect(owner).approve(poolAddress, BigInt(1e18));
      await timeToken.connect(owner).approve(poolAddress, BigInt(1e18));
      await swapPool.connect(owner).deposit(BigInt(1e18), BigInt(1e18));
      // withdraw 500 tokens  from A to B
      await swapPool.connect(owner).withdraw(BigInt(0.5e18), 0);
      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      await swapPool.connect(owner).withdraw(BigInt(0.249e18), 0);

      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      await swapPool.connect(owner).withdraw(BigInt(0.1e18), 0);

      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      const balanceA = await swapPool.balanceA();
      const balanceB = await swapPool.balanceB();

      console.log("tokenA:+,tokenB:*");
      for (let i = 0; i < priceChangesA.length; i++) {
        console.log(`${"*".repeat(priceChangesA[i].toString() + 1)}`);
        console.log(`${"+".repeat(priceChangesB[i].toString() + 1)}`);
      }
      console.log(
        "______________________________________________________________"
      );
      expect(balanceA > balanceB);
    });
  });
  // Add more tests for edge cases and error handling
});
