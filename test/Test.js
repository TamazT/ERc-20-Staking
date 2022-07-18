const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");
const { getAddress } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const {
  experimentalAddHardhatNetworkMessageTraceHook,
} = require("hardhat/config");

describe("Tor Contract Tests", function () {
  let tor;
  let st;
  let mocks;
  this.beforeEach(async function () {
    const Tor = await ethers.getContractFactory("Tornado");
    tor = await Tor.deploy(100);
    const Mocks = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    [deployer, account1, account2, account3] = await ethers.getSigners();
    const Staking = await ethers.getContractFactory("Staking");
    st = await Staking.deploy(tor.address);
  });
  it("Initialise max total supply correctly", async function () {
    assert.equal(await tor.totalSupply(), 100);
  });
  it("will be minted for deployer address", async function () {
    [deployer] = await ethers.getSigners();
    assert.equal(await tor.balanceOf(deployer.address), 25);
    assert.equal(await tor.balanceOf(account1.address), 25);
    assert.equal(await tor.balanceOf(account2.address), 25);
    assert.equal(await tor.balanceOf(account3.address), 25);
  });
  it("Deployer can mint every time", async function () {
    await tor.mint(deployer.address, 100);
    assert.equal(await tor.totalSupply(), 200);
    assert.equal(await tor.balanceOf(deployer.address), 125);
  });
  it("Others cant use fucntion mint", async function () {
    await expect(tor.connect(account1.address).mint(deployer.address, 100)).to
      .be.reverted;
  });
  it("Tokens will be burned", async function () {
    await tor.burn(account1.address, 20);
    assert.equal(await tor.balanceOf(account1.address), 5);
  });
  it("it will be reverted if stake did not opened", async function () {
    await tor.connect(account1).approve(st.address, 5);
    await expect(
      st.connect(account1).stakeTokens(tor.address, 5)
    ).to.be.revertedWith("Stake does not opened");
  });
  it("Tokens will be stacked", async function () {
    await st.openStake();
    await tor.connect(account1).approve(st.address, 5);
    await st.connect(account1).stakeTokens(tor.address, 5);
    assert.equal(await tor.balanceOf(account1.address), 20);
    assert.equal(await st.connect(account1).stakingInfo(), 5);
  });

  it("ChekupKeep not up if interval didnot pass", async function () {
    const { upkeepNeeded } = await st.callStatic.checkUpkeep("0x");
    assert(!upkeepNeeded);
  });

  it("Rewards will be distriburted", async function () {
    await st.openStake();
    await tor.connect(account1).approve(st.address, 5);
    await tor.connect(account2).approve(st.address, 5);
    await st.connect(account1).stakeTokens(tor.address, 5);
    await st.connect(account2).stakeTokens(tor.address, 5);
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");
    await st.performUpkeep([]);
    assert.equal(await st.connect(account1).stakingInfo(), 10);
    assert.equal(await st.connect(account2).stakingInfo(), 10);
  });
  it("unstakeCorrectly", async function () {
    await st.openStake();
    await tor.connect(account1).approve(st.address, 5);
    await tor.connect(account2).approve(st.address, 5);
    await st.connect(account1).stakeTokens(tor.address, 5);
    await st.connect(account2).stakeTokens(tor.address, 5);
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");
    await st.connect(account1).unstake(5);
    assert.equal(await st.connect(account1).stakingInfo(), 0);
  });
});
