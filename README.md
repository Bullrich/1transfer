# **1Transfer**

![Deploy](https://github.com/Bullrich/1transfer/workflows/Deploy%20page/badge.svg)

1Transfer is a `dApp` that provides a **zero hassle** single push **multi-transfer** system.

It supports multiple chains and every single ERC20 token running on that chain.

It was built for the [ETH Global]([https://online.ethglobal.com/](https://online.ethglobal.com/)) hackathon.

## The smart contract

You can find more information about the smart contract in the [contract subdirectory](./contracts)

The smart contract has two methods that can be called from the dApp or from a different contract. Find out how to integrate it into your own contract in the [contract subdirectory](./contracts).

## Development

To develop this project you need to clone and then install and build the dependencies. You need to run `npm install` and `npm run build` which will automatically build all the dependencies and smart contracts typings, as also download some configuration files.

To work on the web app, you can run `npm run dev` and it will automatically serve the page at `https://localhost:5137`
