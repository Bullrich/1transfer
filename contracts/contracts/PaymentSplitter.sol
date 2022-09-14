//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentSplitter {
    address private owner;
    uint256 private surplus;
    mapping (ERC20 => uint256) private tokenSurplus;
    uint256 private constant ethDecimals = 18;

    constructor() {
        owner = msg.sender;
    }

    function getSurplus() public view returns (uint256) {
        require(msg.sender == owner, "Call is not the owner");
        return surplus;
    }

    function getTokenSurplus(ERC20 token) public view returns (uint256) {
        require(msg.sender == owner, "Call is not the owner");
        return tokenSurplus[token];
    }

    function withdrawSurplus() external {
        require(msg.sender == owner, "Call is not the owner");
        require(surplus > 0, "No surplus available");
        address payable own = payable(owner);
        own.transfer(surplus);
        surplus = 0;
    }

    function withdrawTokenSurplus(ERC20 token) external {
        require(msg.sender == owner, "Call is not the owner");
        require(tokenSurplus[token] > 0, "No surplus available for the given token");
        token.transfer(owner, tokenSurplus[token]);
        tokenSurplus[token] = 0;
    }

   function modulo(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, "Value can not be zero");
        require(a > b, "Divisible can not be less than divisor");
        return a % b;
    }

    function getUserTokenBalance(IERC20 token) public view returns (uint) {
        uint tokenBalance = token.balanceOf(msg.sender);
        return tokenBalance;
    }

    // Calculate the modular value into the 0.01 field of 1 eth.
    function calculateRemaining(uint amount, uint recipients, uint decimals) public pure returns (uint) {
        return modulo(amount, recipients * (10 **  decimals));
    }

    // Calculate an equal division value
    function calculatePayment(uint amount, uint recipients, uint decimals) public pure returns (uint256) {
        // Get the remaining value in a 0.01 field
        uint remaining = calculateRemaining(amount, recipients, decimals);
        // Remove this value from the total amount
        uint divisibleValue = amount - remaining;
        // Now we can properly divide the number without having floating points
        return divisibleValue / recipients;
    }

    function splitPayment(address[] memory recipients) public payable {
        // get the amount of recipients
        uint nrOfrecipients = recipients.length;
        // calculate how much each recipient will receive
        uint256 values = calculatePayment(msg.value, nrOfrecipients, ethDecimals - 4);
        uint256 index = 0;
        for (index = 0; index < nrOfrecipients; index++) {
            // convert each recipient and transfer them the amount
            address payable target = payable(recipients[index]);
            target.transfer(values);
        }
        // get the remaining and add it to the surplus
        uint256 remaining = calculateRemaining(msg.value, nrOfrecipients, ethDecimals - 4);
        surplus += remaining;
    }
    function splitTokenPayment(address[] memory recipients, uint256 amount, ERC20 token) public {
        require(token.allowance(msg.sender, address(this)) >= amount, "Insuficient Allowance");
        require(token.transferFrom(msg.sender, address(this),amount), "Transfer Failed");

        uint nrOfrecipients = recipients.length;
        // see if the values has enough decimals to split evenly
        uint decimals = token.decimals();
        uint decimalsToDivide = decimals > 4 ? decimals - 2 : decimals;
        // calculate how much each recipient will receive
        uint256 values = calculatePayment(amount, nrOfrecipients, decimalsToDivide);
        uint256 index = 0;
        for (index = 0; index < nrOfrecipients; index++) {
            // transfer to each recipient the mentioned amount
            token.transfer(recipients[index], values);
        }

        // get the remaining and add it to the surplus
        uint256 remaining = calculateRemaining(amount, nrOfrecipients, decimalsToDivide);
        tokenSurplus[token] += remaining;
    }
}
