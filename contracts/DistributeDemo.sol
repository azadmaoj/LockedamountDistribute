//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

import "contracts/token.sol";

contract Demo {
    uint256 public totalAmount;
    uint256 public minimumUsers;
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public alreadyWithdraw;
    mapping(address => bool) public Users;
    uint256 public totalUsers;
    uint256 public remainUsers;

    constructor(uint256 _amount, uint256 _minimumUsers) {
        require(_minimumUsers > 0, "minimumUsers must be greater than 0");

        minimumUsers = _minimumUsers;
        totalAmount = _amount;
    }

    function joinUser() public {
        require(Users[msg.sender] == false, "User Already Joined");
        Users[msg.sender] = true;
        totalUsers++;
        remainUsers++;
    }

    function withdraw() public {
        require(alreadyWithdraw[msg.sender] == false, "Not in the reward List");
        require(totalUsers >= minimumUsers, "Wait till Minimum User Join");
        uint256 perUserAmount = totalAmount / remainUsers;
        balanceOf[msg.sender] += perUserAmount;
        totalAmount -= perUserAmount;
        alreadyWithdraw[msg.sender] = true;
        remainUsers--;
    }
}
