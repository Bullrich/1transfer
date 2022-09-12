//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract PaymentSplitter {
    address private owner;
    uint256 private surplus;
    uint256 private constant ethMultiplier = 100000 gwei;

    constructor() {
        owner = msg.sender;
    }

    function getSurplus() public view returns (uint256) {
        require(msg.sender == owner, "Call is not the owner");
        return surplus;
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
    function calculateRemaining(uint amount, uint recipients) public pure returns (uint) {
        return modulo(amount, recipients * ethMultiplier);
    }

    // Calculate an equal division value
    function calculatePayment(uint amount, uint recipients) public pure returns (uint256) {
        // Get the remaining value in a 0.01 field
        uint remaining = calculateRemaining(amount, recipients);
        // Remove this value from the total amount
        uint divisibleValue = amount - remaining;
        // Now we can properly divide the number without having floating points
        return divisibleValue / recipients;
    }

    function splitPayment(address[] memory recipients) public payable {
        // get the amount of recipients
        uint nrOfrecipients = recipients.length;
        // calculate how much each recipient will receive
        uint256 values = calculatePayment(msg.value, nrOfrecipients);
        uint256 index = 0;
        for (index = 0; index < nrOfrecipients; index++) {
            // convert each recipient and transfer them the amount
            address payable target = payable(recipients[index]);
            target.transfer(values);
        }
        // get the remaining and add it to the surplus
        uint256 remaining = calculateRemaining(msg.value, nrOfrecipients);
        surplus += remaining;
    }
}
