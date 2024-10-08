/* eslint @typescript-eslint/no-var-requires: "off" */
import {expect} from "chai";
import {ethers, network} from "hardhat";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";

export default async function suite(): Promise<void> {
    describe("DataIndex", () => {
        let snap: string;

        let user1: SignerWithAddress;

        let DataIndex: Contract;
        let DataPointRegistry: Contract;

        let dp: string; // data point

        before(async function () {
            user1 = this.user1;

            DataIndex = this.DataIndex;
            DataPointRegistry = this.DataPointRegistry;

            dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await DataPointRegistry.allocate(user1.address);
        });

        beforeEach(async function () {
            snap = await ethers.provider.send("evm_snapshot", []);
        });

        afterEach(async function () {
            await ethers.provider.send("evm_revert", [snap]);
        });

        it("revert: only owner can approve data manager", async function () {
            await expect(DataIndex.allowDataManager(dp, ethers.ZeroAddress, false)).to.be.revertedWithCustomError(DataIndex, "InvalidDataPointAdmin");
        });

        it("should approve data manager", async function () {
            await expect(DataIndex.connect(user1).getFunction("allowDataManager")(dp, ethers.ZeroAddress, true))
                .emit(DataIndex, "DataPointDMApprovalChanged")
                .withArgs(dp, ethers.ZeroAddress, true);

            expect(await DataIndex.isApprovedDataManager(dp, ethers.ZeroAddress)).to.be.equal(true);
        });

        it("revert: wrong diid calling ownerOf", async function () {
            const diid = await DataIndex.diid(user1.address, ethers.ZeroHash);

            let newDiid = "0x11" + diid.slice(4);

            await expect(DataIndex.ownerOf(newDiid)).to.be.revertedWithCustomError(DataIndex, "IncorrectIdentifier");

            newDiid = await DataIndex.diid(ethers.ZeroAddress, ethers.ZeroHash);

            await expect(DataIndex.ownerOf(newDiid)).to.be.revertedWithCustomError(DataIndex, "IncorrectIdentifier");
        });

        it("should get chainId/account from diid", async function () {
            const diid = await DataIndex.diid(user1.address, ethers.ZeroHash);

            const data = await DataIndex.ownerOf(diid);

            const chainId = data[0];
            const account = data[1];

            const currentChainId = await network.provider.send("eth_chainId");

            expect(account).to.be.equal(user1.address);
            expect(chainId).to.be.equal(currentChainId);
        });

        // Read and write functions are tested with data objects
    });
}
