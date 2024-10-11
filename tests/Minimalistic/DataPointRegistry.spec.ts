/* eslint @typescript-eslint/no-var-requires: "off" */
import {expect} from "chai";
import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import {DataPointRegistry} from "../../typechain";

export default async function suite(): Promise<void> {
    describe("DataPointRegistry", () => {
        let snap: string;

        let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;

        let DataPointRegistry: DataPointRegistry;

        before(async function () {
            deployer = this.adminSigner;
            user1 = this.user1;
            user2 = this.user2;
            DataPointRegistry = this.DataPointRegistry;
        });

        beforeEach(async function () {
            snap = await ethers.provider.send("evm_snapshot", []);
        });

        afterEach(async function () {
            await ethers.provider.send("evm_revert", [snap]);
        });

        it("Should create a new data point", async () => {
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");
        });

        it("revert: NativeCoinDepositIsNotAccepted", async () => {
            await expect(DataPointRegistry.allocate(user1.address, {value: 1})).to.be.revertedWithCustomError(
                DataPointRegistry,
                "NativeCoinDepositIsNotAccepted"
            );
        });

        it("Owner of DataPoint should be its Admin by default", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            expect(await DataPointRegistry.isAdmin(dp, user1.address)).to.be.equal(true);
        });

        it("Unrelated user should not be an Admin", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            expect(await DataPointRegistry.isAdmin(dp, user2.address)).to.be.equal(false);
        });

        it("Should create a new data point registry and change ownership", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).transferOwnership(dp, user2.address)).to.emit(DataPointRegistry, "DataPointOwnershipTransferred");
        });

        it("revert: InvalidDataPointOwner on transfer ownership", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user2).transferOwnership(dp, user2.address)).to.be.revertedWithCustomError(
                DataPointRegistry,
                "InvalidDataPointOwner"
            );
        });

        it("Should grant admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).grantAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminGranted");
        });

        it("Should return false granting two times admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).grantAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminGranted");

            expect(await DataPointRegistry.connect(user1).grantAdminRole.staticCall(dp, user2.address)).to.be.equal(false);
        });

        it("revert: InvalidDataPointOwner on grant admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user2).grantAdminRole(dp, user2.address)).to.be.revertedWithCustomError(
                DataPointRegistry,
                "InvalidDataPointOwner"
            );
        });

        it("Should revoke admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).grantAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminGranted");

            await expect(DataPointRegistry.connect(user1).revokeAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminRevoked");
        });

        it("Should return false revoking two times admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).grantAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminGranted");

            await expect(DataPointRegistry.connect(user1).revokeAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminRevoked");

            expect(await DataPointRegistry.connect(user1).revokeAdminRole.staticCall(dp, user2.address)).to.be.equal(false);
        });

        it("revert: InvalidDataPointOwner on revoke admin role", async () => {
            const dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await expect(DataPointRegistry.allocate(user1.address)).to.emit(DataPointRegistry, "DataPointAllocated");

            await expect(DataPointRegistry.connect(user1).grantAdminRole(dp, user2.address)).to.emit(DataPointRegistry, "DataPointAdminGranted");

            await expect(DataPointRegistry.connect(user2).revokeAdminRole(dp, user2.address)).to.be.revertedWithCustomError(
                DataPointRegistry,
                "InvalidDataPointOwner"
            );
        });
    });
}
