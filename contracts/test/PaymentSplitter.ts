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

    describe("Deployment", function () {
        it("Should return correct module operation", async function () {
            const { splitter, accounts } = await loadFixture(deployPaymentSplitterFixture);

            const moduleValues: [number, number][] = [];
            for (let index = 0; index < 100; index++) {
                moduleValues[index] = [Math.floor(Math.random() * 100000) + 100, Math.floor(Math.random() * 100) + 1]
            };

            const promises = await Promise.all(moduleValues.map(v => splitter.modulo(v[0],v[1])));

            for (let i = 0; i < moduleValues.length; i++) {
                const [a, b] = moduleValues[i];
                expect(promises[i].toNumber()).to.equal(a % b);
            }
        });
    });
});
