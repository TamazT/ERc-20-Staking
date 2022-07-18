// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Staking is KeeperCompatibleInterface {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public erc20TokenAddress;

    mapping(address => uint256) stakingAmountOfAddress;
    bool stakeInfo = false;
    address[] public stakers;
    address owner;
    uint public interval = 60;
    uint public lastTimeStamp;

    constructor(IERC20 _erc20TokenAddress) {
        erc20TokenAddress = _erc20TokenAddress;
        owner = msg.sender;
        lastTimeStamp = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function openStake() public onlyOwner {
        stakeInfo = true;
    }

    function stakeTokens(IERC20 token, uint256 amount) public {
        require(stakeInfo == true, "Stake does not opened");
        token.safeTransferFrom(msg.sender, address(this), amount);
        stakingAmountOfAddress[msg.sender] = stakingAmountOfAddress[msg.sender]
            .add(amount);
        stakers.push(msg.sender);
    }

    function stakingInfo() public view returns (uint256) {
        return stakingAmountOfAddress[msg.sender];
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            addValueForStackers();
            lastTimeStamp = block.timestamp;
        }
    }

    function addValueForStackers() internal {
        for (uint256 i; i < stakers.length; i++) {
            address a = stakers[i];
            uint256 amount = stakingAmountOfAddress[a];
            stakingAmountOfAddress[a] = amount * 2;
        }
    }

    function unstake(uint256 _amount) public {
        require(
            stakingAmountOfAddress[msg.sender] >= _amount,
            "You are trying withwrad more than you have"
        );
        erc20TokenAddress.safeTransfer(msg.sender, _amount);
        stakingAmountOfAddress[msg.sender] =
            stakingAmountOfAddress[msg.sender] -
            _amount;
    }
}
