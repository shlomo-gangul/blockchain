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
    it("Should swap form TME to SPC and show the diffrence", async function () {
      const poolAddress = await swapPool.getAddress();
      const timeTokenAddress = await timeToken.getAddress();
      const spaceTokenAddress = await spaceToken.getAddress();
      const priceChangesA = [];
      const priceChangesB = [];
      // First deposit tokens
      await spaceToken.connect(owner).approve(poolAddress, BigInt(10e18));
      await timeToken.connect(owner).approve(poolAddress, BigInt(10e18));
      await swapPool.connect(owner).deposit(BigInt(10e18), BigInt(10e18));
      await timeToken.connect(owner).transfer(addr1.address, BigInt(9e18));
      // swap 0.2e18 tokens  from TME to SPC
      console.log("TME:", await timeToken.balanceOf(addr1.address));
      console.log("SPC:", await spaceToken.balanceOf(addr1.address));
      await timeToken.connect(addr1).approve(poolAddress, BigInt(2e18));
      await swapPool
        .connect(addr1)
        .swap(timeTokenAddress, spaceTokenAddress, BigInt(2e18));
      console.log("TME:", await timeToken.balanceOf(addr1.address));
      console.log("SPC:", await spaceToken.balanceOf(addr1.address));
      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      await timeToken.connect(addr1).approve(poolAddress, BigInt(3e18));
      await swapPool
        .connect(addr1)
        .swap(timeTokenAddress, spaceTokenAddress, BigInt(3e18));
      console.log("TME:", await timeToken.balanceOf(addr1.address));
      console.log("SPC:", await spaceToken.balanceOf(addr1.address));
      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      await timeToken.connect(addr1).approve(poolAddress, BigInt(1e18));
      await swapPool
        .connect(addr1)
        .swap(timeTokenAddress, spaceTokenAddress, BigInt(1e18));
      console.log("TME:", await timeToken.balanceOf(addr1.address));
      console.log("SPC:", await spaceToken.balanceOf(addr1.address));
      console.log("balance A:", await swapPool.balanceA());
      console.log("balance B:", await swapPool.balanceB());
      console.log("price A:", BigInt(await swapPool.priceA()));
      console.log("price B:", BigInt(await swapPool.priceB()));
      priceChangesA.push(await swapPool.priceA());
      priceChangesB.push(await swapPool.priceB());
      const priceA = await swapPool.priceA();
      const priceB = await swapPool.priceB();

      console.log("tokenA:+,tokenB:*");
      for (let i = 0; i < priceChangesA.length; i++) {
        console.log(`${"*".repeat(priceChangesA[i].toString() + 1)}`);
        console.log(`${"+".repeat(priceChangesB[i].toString() + 1)}`);
      }
      console.log(
        "______________________________________________________________"
      );
      expect(priceA > priceB);
    });
  });
  // Add more tests for edge cases and error handling
});
