# 1Transfer Smart Contract

Here you can find the contract for 1Transfer.

It is available in [contracts/PaymentSplitter.sol](contracts/PaymentSplitter.sol).

You need to install (`npm install`) the dependencies to work on this repository.

You can also test (`npm run test`) and build (`npm run build`) the smart contract.

## Contract addresses

- Mainnet: [0x0ec74463be41b6145980bb3fd3e54ec983738e9a](https://etherscan.io/address/0x0ec74463be41b6145980bb3fd3e54ec983738e9a)
- Goerli: [0xdefacadafc5907c8c6c2babdf9acf964ceb6f972](https://goerli.etherscan.io/address/0xdefacadafc5907c8c6c2babdf9acf964ceb6f972)
- Optimism: [0xb2ace012e6787e63e97e20dcf6338d2b4a1f41c6](https://optimistic.etherscan.io/address/0xb2ace012e6787e63e97e20dcf6338d2b4a1f41c6)
- Polygon: [0x81025813e9fc8590a4b4767a75ff9d9fe185b868](https://polygonscan.com/address/0x81025813e9fc8590a4b4767a75ff9d9fe185b868)

## Building on top of the contract

To implement the smart contract into your own system you need to refer to the following interface:

```solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITransfer {
    /**
     * @dev Splits value between several users
     * Expects to recive a value bigger than the amount of recipients
     * Each recipient needs to be an address
     */
    function splitPayment(address[] memory recipients) external payable;

    /**
     * @dev Splits an amount of tokens between several users
     * Expects to receive an amount bigger than the amount of recipients
     * Each recipient needs to be an address
     * The token needs to be an ERC20 token that implements the IERC20Metadata interface
     * Token needs to have been approved to be used by this contract address
     */
    function splitTokenPayment(
        address[] memory recipients,
        uint256 amount,
        address token
    ) external;
}
```

You can simply copy and paste this interface on top of your smart contract, or save it in a file and import it.

Let’s develop a contract where people can pay for a service, and this amount is automatically distributed between you and your partners.

For this demo, we will be working on the `Goerli` test net. 

We will have to store a variable of type `ITransfer` which will be an address wrapped in the interface. We can find the address in [Contract addresses](#contract-addresses).

We will also store an array with the addresses of all the people that will receive their share of the payment.

```solidity
import "./ITransfer.sol";

contract PaymentSystem {
    ITransfer transfer = ITransfer(0xdefacadafc5907c8c6c2babdf9acf964ceb6f972);
		address[] partners = [0x0001, 0x0002, 0x0003];
}
```

### Ether payment system

For the payment system, we can have a function that will work in the following way:

```solidity
function payForService() external payable {
        // enable the service that the user paid for here
        transfer.splitPayment{value: msg.value}(partners);
    }
```

In the function, we will make our assertions, enable the system to work, and afterward, invoke the method `splitPayment` from the `ITransfer` interface. This function will evenly split the payment between all the people in the `partners` address array.

### ERC-20 payment system

If you are accepting an ERC-20 currency as payment instead, you need to add an extra step.

The first requirement is to import the interface for IERC20: `import "@openzeppelin/contracts/token/ERC20/IERC20.sol";`

The process is very similar to the previous one, but there are two differences:

- The token usage needs to be approved, for this the `approve` method in the token contract must be invoked passing the address of the `ITransfer` deployed contract and the number of tokens that will be sent to the contract.
- You will have to call the method `splitTokenPayment` with the accounts that will receive a payment, the number of tokens you wish to split, and the address where the smart contract of the token is available.

```solidity
		IERC20 constant token = IERC20(0x123456);
    function payForServiceWithERC20(uint amount) external payable {
        // enable the service that the user paid for 
				// ...
        // approve the token to be used by the 1Transfer contract
        token.approve(address(transfer), amount);
        // invoke the method with the amount of tokens and the address of the token smart contract
        transfer.splitTokenPayment(partners, amount, address(token));
    }
```

## Fee

The system only takes fees when the number (dividend) can not be perfectly divided by the number of people who will receive the payment (divisor). **For most cases, there will be no fees.**

If there is a fee this is **always** clearly shown to the user before he approves the operation. Gas costs are **not** counted as fees.

For example: 

- `8` is perfectly divisible by `2`: `8 / 2 = 4`. **No fee is taken here**.
- `10` is **not** perfectly divisible by `3`: `10 / 3 = 3.33333...`
    - In this case, there is a remaining `3`.
    - A **fee is taken** on the 4th decimal point: `0.0001`
    - This is subtracted from the dividend. This makes it perfectly divisible by the divisor.
    - `(10 - 0.0001) / 3 = 3.3333`
    - Each user will receive `3.3333`

### Formula

The exact formula for this process is the following:

`amount - ((amount % divisor) * (10 ** (decimals - 4)) / divisor`

In the case that the currency is a token, the decimal subtraction is 2 instead of 4:

`amount - ((amount % divisor) * (10 ** (decimals - 2)) / divisor`

## Edge cases to consider

### Minimum values to consider

The contract doesn’t work with values that are too low. The minimum value accepted by the contract is `(recipients * (10 ** 14) / (10 ** 18))`, which, if you have 3 recipients, would be `0.0004` ethers.

In the case of ERC20 tokens with more than 4 decimals it is `(recipients * (10 ** 16) / (10 ** 18))`, which would be `0.04` of the given token.

### Tokens must implement the IERC20Metadata interface

The `ERC20` tokens that are used must support the method `decimals` from the [IERC20Metadata](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/IERC20Metadata.sol) interface.
