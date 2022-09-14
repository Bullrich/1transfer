// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DemoToken is ERC20 {
    constructor() ERC20("DemoToken", "DT") {
        _mint(msg.sender, 500 * 10 ** decimals());
        // _mint(msg.sender, 100);
    }
}
