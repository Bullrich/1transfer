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

        const DemoToken = await ethers.getContractFactory("DemoToken");
        const token = await DemoToken.deploy();

        return { splitter, owner, accounts, token };
    }

    /** Get multiple random values except the first one */
    function getMultipleRandom<T>(arr: T[], num: number): T[] {
        if (num > arr.length - 1) {
            throw new Error("Array out of bounds");
        }
        const shuffled = [...arr].slice(1).sort(() => 0.5 - Math.random());

        return shuffled.slice(0, num);
    }

    function fillArray<T>(element: T, num: number): T[] {
        return new Array<T>(num).fill(element);
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
                const multiplier = utils.parseUnits("10", "wei").pow(14);
                const amountInEth = utils.parseUnits(amount.toString());
                const expectedRemaining = amountInEth.mod(utils.parseUnits(divisor.toString(), "wei").mul(multiplier));
                const contractRemaining = await splitter.calculateRemaining(amountInEth, divisor, 14);
                expect(contractRemaining).to.equal(expectedRemaining);
            }
        });

        it("Should calculate payment correctly", async function () {
            const { splitter } = await loadFixture(deployPaymentSplitterFixture);

            const moduleValues = getModuloPairs();
            const { utils } = ethers;

            for (let i = 0; i < moduleValues.length; i++) {
                const [amount, divisor] = moduleValues[i];
                const multiplier = utils.parseUnits("10", "wei").pow(14);
                const amountInEth = utils.parseUnits(amount.toString());
                const remaining = amountInEth.mod(utils.parseUnits(divisor.toString(), "wei").mul(multiplier));
                const expectedDivision = amountInEth.sub(remaining).div(divisor);
                const contractRemaining = await splitter.calculatePayment(amountInEth, divisor, 14);
                expect(contractRemaining).to.equal(expectedDivision);
            }
        });
    });

    describe("Split", function () {
        describe("Eth Transactions", function () {
            it("Should withdraw ether for payment", async function () {
                const ethToSplit = 0.8;
                const accountToSplit = 4;
                const { splitter, accounts, owner } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);

                const value = ethers.utils.parseEther(ethToSplit.toString());
                await splitter.splitPayment(addresses, { value });

                await expect(splitter.splitPayment(addresses, { value })).to.changeEtherBalance(owner, value.mul(-1));
            });

            it("Should split payment evenly", async function () {
                const ethToSplit = 0.8;
                const accountToSplit = 4;
                const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);
                const amountToAdd = fillArray(ethers.utils.parseEther((ethToSplit / accountToSplit).toString()), accountToSplit);

                const value = ethers.utils.parseEther(ethToSplit.toString());
                await splitter.splitPayment(addresses, { value });

                await expect(splitter.splitPayment(addresses, { value })).to.changeEtherBalances(randomAccounts, amountToAdd);
            });

            it("Should split payment evenly with surplus", async function () {
                const ethToSplit = 0.9;
                const accountToSplit = 7;
                const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);
                const remaining = await splitter.calculateRemaining(ethers.utils.parseEther(ethToSplit.toString()), accountToSplit, 14);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);
                const amountToAdd = fillArray(ethers.utils.parseEther(ethToSplit.toString()).sub(remaining).div(accountToSplit), accountToSplit);

                const value = ethers.utils.parseEther(ethToSplit.toString());

                await expect(splitter.splitPayment(addresses, { value })).to.changeEtherBalances(randomAccounts, amountToAdd);

                const surplus = await splitter.getSurplus();
                expect(surplus).to.equal(remaining);
            });

            it("Should withdraw surplus", async function () {
                const ethToSplit = 0.9;
                const accountToSplit = 7;
                const { splitter, owner, accounts } = await loadFixture(deployPaymentSplitterFixture);
                const remaining = await splitter.calculateRemaining(ethers.utils.parseEther(ethToSplit.toString()), accountToSplit, 14);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);

                const value = ethers.utils.parseEther(ethToSplit.toString());
                await splitter.splitPayment(addresses, { value });

                const surplus = await splitter.getSurplus();
                expect(surplus).to.equal(remaining);

                await expect(splitter.withdrawSurplus()).to.changeEtherBalance(owner, remaining);
            });

            it("Should revert if no surplus available", async function () {
                const { splitter } = await loadFixture(deployPaymentSplitterFixture);

                const surplus = await splitter.getSurplus();
                expect(surplus).to.equal(0);

                await expect(splitter.withdrawSurplus()).to.be.revertedWith("No surplus available");
            });

            it("Should revert if array is empty", async function () {
                const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);

                await expect(splitter.splitPayment([])).to.be.revertedWith("Value can not be zero");
            });

            it("Should revert if no ether has been sent", async function () {
                const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);
                const addresses = accounts.map(a => a.address);

                await expect(splitter.splitPayment(addresses)).to.be.revertedWith("Divisible can not be less than divisor");
            });
        });

        describe("Token Transactions", function () {
            it("Should revert when tokens are not approved", async function () {
                const tokensToSplit = 200;
                const accountToSplit = 4;
                const { splitter, accounts, token } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);

                const decimals = await token.decimals();

                const amount = ethers.utils.parseUnits(tokensToSplit.toString(), decimals);

                await expect(splitter.splitTokenPayment(addresses, amount, token.address)).to.be.revertedWith("Insuficient Allowance");
            });

            it("Should withdraw token for payment", async function () {
                const tokensToSplit = 200;
                const accountToSplit = 4;
                const { splitter, accounts, token, owner } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);

                const decimals = await token.decimals();

                const amount = ethers.utils.parseUnits(tokensToSplit.toString(), decimals);

                await token.approve(splitter.address, amount);

                await expect(splitter.splitTokenPayment(addresses, amount, token.address)).to.changeTokenBalance(token, owner, amount.mul(-1));
            });

            it("Should split payment evenly", async function () {
                const tokensToSplit = 200;
                const accountToSplit = 4;
                const { splitter, accounts, token } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);
                const decimals = await token.decimals();
                const amountToAdd = fillArray(ethers.utils.parseUnits((tokensToSplit / accountToSplit).toString(), decimals).toString(), accountToSplit);

                const amount = ethers.utils.parseUnits(tokensToSplit.toString(), decimals);

                await token.approve(splitter.address, amount);

                await expect(splitter.splitTokenPayment(addresses, amount, token.address)).to.changeTokenBalances(token, randomAccounts, amountToAdd);
            });

            it("Should split payment evenly with surplus", async function () {
                const tokensToSplit = 200;
                const accountToSplit = 4;
                const { splitter, accounts, token } = await loadFixture(deployPaymentSplitterFixture);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);
                const decimals = await token.decimals();
                const remaining = await splitter.calculateRemaining(ethers.utils.parseUnits(tokensToSplit.toString(), decimals), accountToSplit, decimals - 2);

                const amountToAdd = fillArray(ethers.utils.parseUnits((tokensToSplit).toString(), decimals).sub(remaining).div(accountToSplit), accountToSplit);

                const amount = ethers.utils.parseUnits(tokensToSplit.toString(), decimals);

                await token.approve(splitter.address, amount);

                await expect(splitter.splitTokenPayment(addresses, amount, token.address)).to.changeTokenBalances(token, randomAccounts, amountToAdd);

                const surplus = await splitter.getTokenSurplus(token.address);
                expect(surplus).to.equal(remaining);
            });

            it("Should withdraw surplus", async function () {
                const tokensToSplit = 200;
                const accountToSplit = 7;
                const { splitter, accounts, token, owner } = await loadFixture(deployPaymentSplitterFixture);
                const decimals = await token.decimals();
                const remaining = await splitter.calculateRemaining(ethers.utils.parseUnits(tokensToSplit.toString(), decimals), accountToSplit, decimals - 2);
                const randomAccounts = getMultipleRandom(accounts, accountToSplit);
                const addresses = randomAccounts.map(acc => acc.address);

                const amount = ethers.utils.parseUnits(tokensToSplit.toString(), decimals);

                await token.approve(splitter.address, amount);

                await splitter.splitTokenPayment(addresses, amount, token.address);

                const surplus = await splitter.getTokenSurplus(token.address);
                expect(surplus).to.equal(remaining);

                await expect(splitter.withdrawTokenSurplus(token.address)).to.changeTokenBalance(token, owner, remaining);
            });

            it("Should revert if no surplus available", async function () {
                const { splitter, token } = await loadFixture(deployPaymentSplitterFixture);

                const surplus = await splitter.getTokenSurplus(token.address);
                expect(surplus).to.equal(0);

                await expect(splitter.withdrawTokenSurplus(token.address)).to.be.revertedWith("No surplus available for the given token");
            });

            it("Should revert if array is empty", async function () {
                const { splitter, token } = await loadFixture(deployPaymentSplitterFixture);

                await token.approve(splitter.address, 10);
                await expect(splitter.splitTokenPayment([], 10, token.address)).to.be.revertedWith("Value can not be zero");
            });

            it("Should revert if no amount has been set", async function () {
                const { splitter, accounts, token } = await loadFixture(deployPaymentSplitterFixture);
                const addresses = accounts.map(a => a.address);

                await expect(splitter.splitTokenPayment(addresses, 0, token.address)).to.be.revertedWith("Divisible can not be less than divisor");
            });

            it("Should revert if approved amount is smaller than set amount", async function () {
                const { splitter, accounts, token } = await loadFixture(deployPaymentSplitterFixture);
                const addresses = accounts.map(a => a.address);
                await token.approve(splitter.address, 10);

                await expect(splitter.splitTokenPayment(addresses, 100, token.address)).to.be.revertedWith("Insuficient Allowance");
            });
        });
    });
});
