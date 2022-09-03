//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

contract PaymentSplitter {
   function modulo(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, "Value can not be zero");
        require(a > b, "Divisible can not be less than divisor");
        return a % b;
    }

    // Calculate the modular value into the 0.01 field of 1 eth.
    function calculateRemaining(uint amount, uint recipients) public pure returns (uint) {
        return modulo(amount, recipients * 100000 gwei);
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
}
