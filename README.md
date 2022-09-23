# **1Transfer**

![Deploy](https://github.com/Bullrich/1transfer/workflows/Deploy%20page/badge.svg)

1Transfer is a `dApp` that provides a **zero hassle** single push **multi-transfer** system.

It supports multiple chains and every single ERC20 token running on that chain.

It was built for the [ETH Global]([https://online.ethglobal.com/](https://online.ethglobal.com/)) hackathon.

## The smart contract

You can find more information about the smart contract in the [contract subdirectory](./contracts)

The smart contract has two methods that can be called from the dApp or from a different contract. Find out how to integrate it into your own contract in the [contract subdirectory](./contracts).

### Fee

The system only takes fees when the number can not be perfectly divided by the number of people who will receive the payment. For most cases, there will be no fees.

For example: 

- `8` is perfectly divisible by `2`: `8 / 2 = 4`. **No fee is taken here**.
- `10` is **not** perfectly divisible by `3`: `10 / 3 = 3.33333...`
    - In this case, there is a remaining `3`.
    - A **fee is taken** on the 4th decimal point: `0.0001`
    - This is subtracted from the total
    - `(10 - 0.0001) / 3`
    - Each user will receive `3.3333`

### Formula

The exact formula for this process is the following:

`amount - ((amount % divisor) ^ (10 * (decimals - 4)) / divisor`

In the case that the currency is a token, the decimal subtraction is 2 instead of 4:

`amount - ((amount % divisor) ^ (10 * (decimals - 2)) / divisor`

## Development

To develop this project you need to clone and then install and build the dependencies. You need to run `npm install` and `npm run build` which will automatically build all the dependencies and smart contracts typings, as also download some configuration files.

To work on the web app, you can run `npm run dev` and it will automatically serve the page at `https://localhost:5137`
