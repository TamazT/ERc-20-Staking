// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tornado is ERC20 {
    mapping(address => uint256) addressLockedTokens;
    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do it");
        _;
    }

    constructor(uint256 initialSupply) public ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply / 4);
        _mint(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, initialSupply / 4);
        _mint(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, initialSupply / 4);
        _mint(0x90F79bf6EB2c4f870365E785982E1f101E93b906, initialSupply / 4);
        owner = msg.sender;
    }

    function showbalance() public returns (uint256) {
        return address(this).balance;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
    }
}
