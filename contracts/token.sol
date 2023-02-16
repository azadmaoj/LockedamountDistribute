//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Token is ERC20 {
    constructor() ERC20("Demo", "Demo") {
        _mint(msg.sender, 1000**18);
    }
}
