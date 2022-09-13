import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PaymentSplitter", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployPaymentSplitterFixture() {

        // Contracts are deployed using the first signer/account by default
        const accounts = await ethers.getSigners();
        const [owner] = accounts;

        const PaymentSplitter = await ethers.getContractFactory("PaymentSplitter");
        const splitter = await PaymentSplitter.deploy();

        return { splitter, owner, accounts };
    }

    /** Get multiple random values except the first one */
    function getMultipleRandom<T>(arr: T[], num: number): T[] {
        if (num > arr.length - 1) {
            throw new Error("Array out of bounds");
        }
        const shuffled = [...arr].slice(1).sort(() => 0.5 - Math.random());

        return shuffled.slice(0, num);
    }

    describe("Deployment", function () {
        function getModuloPairs(limit: number = 100): [number, number][] {
            const moduleValues: [number, number][] = [];
            for (let index = 0; index < limit; index++) {
                moduleValues[index] = [Math.floor(Math.random() * 100000) + 100, Math.floor(Math.random() * 100) + 1]
            };
            return moduleValues;
        }

        it("Should set the surplus to zero", async function () {
            const { splitter } = await loadFixture(deployPaymentSplitterFixture);

            expect(await splitter.getSurplus()).to.equal(0);
        });

        it("Should return correct module operation", async function () {
            const { splitter } = await loadFixture(deployPaymentSplitterFixture);

            const moduleValues: [number, number][] = getModuloPairs();

            const promises = await Promise.all(moduleValues.map(v => splitter.modulo(v[0], v[1])));

            for (let i = 0; i < moduleValues.length; i++) {
                const [a, b] = moduleValues[i];
                expect(promises[i].toNumber()).to.equal(a % b);
            }
        });

        it("Should calculate remaining correctly", async function () {
            const { splitter } = await loadFixture(deployPaymentSplitterFixture);

            const moduleValues = getModuloPairs();
            const { utils } = ethers;

            for (let i = 0; i < moduleValues.length; i++) {
                const [amount, divisor] = moduleValues[i];
                const multiplier = utils.parseUnits("100000", "gwei");
                const amountInEth = utils.parseUnits(amount.toString());
                const expectedRemaining = amountInEth.mod(utils.parseUnits(divisor.toString(), "wei").mul(multiplier));
                expect(await splitter.calculateRemaining(amountInEth, divisor)).to.equal(expectedRemaining);
            }
        });

        it("Should calculate payment correctly", async function () {
            const { splitter } = await loadFixture(deployPaymentSplitterFixture);

            const moduleValues = getModuloPairs();
            const { utils } = ethers;

            for (let i = 0; i < moduleValues.length; i++) {
                const [amount, divisor] = moduleValues[i];
                const multiplier = utils.parseUnits("100000", "gwei");
                const amountInEth = utils.parseUnits(amount.toString());
                const remaining = amountInEth.mod(utils.parseUnits(divisor.toString(), "wei").mul(multiplier));
                const expectedDivision = amountInEth.sub(remaining).div(divisor);
                expect(await splitter.calculatePayment(amountInEth, divisor)).to.equal(expectedDivision);
            }
        });
    });

    describe("Split", function () {
        it("Should split payment evenly", async function () {
            const ethToSplit = 0.8;
            const accountToSplit = 4;
            const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);
            const randomAccounts = getMultipleRandom(accounts, accountToSplit);
            const addresses = await Promise.all(randomAccounts.map(acc => acc.getAddress()));
            const balances = await Promise.all(randomAccounts.map(acc => acc.getBalance()));
            const amountToAdd = ethers.utils.parseEther((ethToSplit / accountToSplit).toString());
            const expectedBalances = balances.map(balance => balance.add(amountToAdd));

            const value = ethers.utils.parseEther(ethToSplit.toString());
            await splitter.splitPayment(addresses, { value })

            const postTxBalances = await Promise.all(randomAccounts.map(acc => acc.getBalance()));
            for (let i = 0; i < postTxBalances.length; i++) {
                expect(postTxBalances[i].toString()).to.equal(expectedBalances[i].toString());
            }
        });

        it("Should split payment evenly with surplus", async function () {
            const ethToSplit = 0.9;
            const accountToSplit = 7;
            const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);
            const remaining = await splitter.calculateRemaining(ethers.utils.parseEther(ethToSplit.toString()), accountToSplit);
            const randomAccounts = getMultipleRandom(accounts, accountToSplit);
            const addresses = await Promise.all(randomAccounts.map(acc => acc.getAddress()));
            const balances = await Promise.all(randomAccounts.map(acc => acc.getBalance()));
            const amountToAdd = ethers.utils.parseEther(ethToSplit.toString()).sub(remaining).div(accountToSplit);
            const expectedBalances = balances.map(balance => balance.add(amountToAdd));

            const value = ethers.utils.parseEther(ethToSplit.toString());
            await splitter.splitPayment(addresses, { value })

            const postTxBalances = await Promise.all(randomAccounts.map(acc => acc.getBalance()));
            for (let i = 0; i < postTxBalances.length; i++) {
                expect(postTxBalances[i].toString()).to.equal(expectedBalances[i].toString());
            }
            const surplus = await splitter.getSurplus();
            expect(surplus).to.equal(remaining);
        });

        it("Should withdraw surplus", async function () {
            const ethToSplit = 0.9;
            const accountToSplit = 7;
            const { splitter, owner, accounts } = await loadFixture(deployPaymentSplitterFixture);
            const remaining = await splitter.calculateRemaining(ethers.utils.parseEther(ethToSplit.toString()), accountToSplit);
            const randomAccounts = getMultipleRandom(accounts, accountToSplit);
            const addresses = await Promise.all(randomAccounts.map(acc => acc.getAddress()));

            const value = ethers.utils.parseEther(ethToSplit.toString());
            await splitter.splitPayment(addresses, { value });

            const surplus = await splitter.getSurplus();
            expect(surplus).to.equal(remaining);

            expect(await splitter.withdrawSurplus()).to.changeEtherBalance(owner, remaining);
        });
    })
});
