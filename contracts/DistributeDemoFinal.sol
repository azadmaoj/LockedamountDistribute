//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/token.sol";

contract DistributeDemo {
    IERC20 public erc20Token;
    uint256 public totalAmount;
    uint256 public minimumUsers;
    mapping(address => bool) public alreadyWithdraw;
    mapping(address => bool) public Users;
    uint256 public totalUsers;

    constructor(address _erc20Token, uint256 _minimumUsers) {
        require(_minimumUsers > 0, "minimumUsers must be greater than 0");
        minimumUsers = _minimumUsers;
        erc20Token = IERC20(_erc20Token);
    }

    /**
       @dev this function will lock the reward amount in the contract 
       @param _amount will be the reward amount 
    */
    function rewardAmount(uint256 _amount) external {
        totalAmount += _amount;
        erc20Token.transferFrom(msg.sender, address(this), _amount);
    }

    /**
    @dev User will join to get the reward 
     */
    function joinForReward() external {
        require(Users[msg.sender] == false, "User Already Joined");
        Users[msg.sender] = true;
        totalUsers++;
    }

    /**
     @dev Joined User will withdraw the reward amount 
      */
    function withdrawReward() external {
        require(alreadyWithdraw[msg.sender] == false, "Not in the reward List");
        require(totalUsers >= minimumUsers, "Wait till Minimum User Join");
        uint256 perUserAmount = totalAmount / totalUsers;
        alreadyWithdraw[msg.sender] = true;
        erc20Token.transfer(msg.sender, perUserAmount);
    }
}
