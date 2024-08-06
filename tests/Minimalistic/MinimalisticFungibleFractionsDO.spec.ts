/* eslint @typescript-eslint/no-var-requires: "off" */
import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import {factories} from "../../typechain";

export default async function suite(): Promise<void> {
    describe("MinimalisticFungibleFractionsDO", () => {
        let snap: string;

        let user1: SignerWithAddress;
        let user2: SignerWithAddress;

        let DataIndex: Contract;
        let DataPointRegistry: Contract;

        let MinimalisticFungibleFractionsDO: any;

        let IFungibleFractionsOperations: any;

        let dp: string; // data point

        before(async function () {
            user1 = this.user1;
            user2 = this.user2;

            DataIndex = this.DataIndex;
            DataPointRegistry = this.DataPointRegistry;

            MinimalisticFungibleFractionsDO = this.MinimalisticFungibleFractionsDO;

            IFungibleFractionsOperations = new ethers.Interface(
                factories.contracts.interfaces.IFungibleFractionsOperations__factory.abi
            );

            dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await DataPointRegistry.allocate(user1.address);
            
            await MinimalisticFungibleFractionsDO.connect(user1).setDataIndexImplementation(dp, await DataIndex.getAddress());
            
            await DataIndex.connect(user1).getFunction("allowDataManager")(dp, user1.address, true);
        });

        beforeEach(async function () {
            snap = await ethers.provider.send("evm_snapshot", []);
        });

        afterEach(async function () {
            await ethers.provider.send("evm_revert", [snap]);
        });

        it("revert: only DataIndex can call write function", async function () {
            const unknownSelector = "0x00000000"

            await expect(
                MinimalisticFungibleFractionsDO.connect(user1).getFunction("write")(dp, unknownSelector, "0x")
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "InvalidCaller");
        });
        
        it("revert: only data manager can write data", async function () {
            const unknownSelector = "0x00000000"

            await expect(
                DataIndex.connect(user2).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, unknownSelector, "0x")
            ).to.be.revertedWithCustomError(DataIndex, "DataManagerNotApproved");
        });

        it("revert: UnknownWriteOperation", async function () {
            const unknownSelector = "0x00000000"

            await expect(
                DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, unknownSelector, "0x")
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "UnknownWriteOperation");
        });

        it("revert: InsufficientBalance in burn", async function () {
            const burnSelector = IFungibleFractionsOperations.getFunction("burn").selector;

            const amount = ethers.parseEther("100");

            const id = 1;

            const burnArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amount]);
            
            await expect(
                DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, burnSelector, burnArg)
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "InsufficientBalance");
        });

        it("revert: InsufficientBalance in transferFrom", async function () {
            const transferFromSelector = IFungibleFractionsOperations.getFunction("transferFrom").selector;

            const amount = ethers.parseEther("100");

            const id = 1;

            const transferFromArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "address", "uint256", "uint256"], [user2.address, user1.address, id, amount]);

            await expect(
                DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, transferFromSelector, transferFromArg)
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "InsufficientBalance");
        });

        it("revert: InsufficientBalance in batch transferFrom", async function () {
            const transferFromSelector = IFungibleFractionsOperations.getFunction("batchTransferFrom").selector;

            const amount1 = ethers.parseEther("100");
            const amount2 = ethers.parseEther("50");

            const id1 = 1;
            const id2 = 2;

            const transferFromArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "address", "uint256[]", "uint256[]"], [user2.address, user1.address, [id1, id2], [amount1, amount2]]);

            await expect(
                DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, transferFromSelector, transferFromArg)
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "InsufficientBalance");
        });

        it("balanceOf should return 0 for unknown account", async function () {
            const balanceOfSelector = IFungibleFractionsOperations.getFunction("balanceOf").selector;

            const id = 1;

            const balanceOfArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [user2.address, id]);

            const balanceOf = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg);

            expect(balanceOf).to.equal(ethers.ZeroHash);
        });

        it("should mint fractions and update balanceOf and totalSupply", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const balanceOfSelector = IFungibleFractionsOperations.getFunction("balanceOf").selector;
            const totalSupplySelector = IFungibleFractionsOperations.getFunction("totalSupply").selector;

            const amount = ethers.parseEther("100");

            const id = 1;

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amount]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);
        
            const balanceOfArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [user2.address, id]);

            const balanceOf = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg);

            const totalSupplyArg = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [id]);

            const totalSupply = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, totalSupplySelector, totalSupplyArg);

            expect(balanceOf).to.equal(amount);
            expect(totalSupply).to.equal(amount);
        });

        it("should burn fractions and update balanceOf and totalSupply", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const burnSelector = IFungibleFractionsOperations.getFunction("burn").selector;
            const balanceOfSelector = IFungibleFractionsOperations.getFunction("balanceOf").selector;
            const totalSupplySelector = IFungibleFractionsOperations.getFunction("totalSupply").selector;

            const amountMint = ethers.parseEther("100");
            const amountBurn = ethers.parseEther("75");

            const id = 1;

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amountMint]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);

            const burnArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amountBurn]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, burnSelector, burnArg);
        
            const balanceOfArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [user2.address, id]);

            const balanceOf = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg);

            const totalSupplyArg = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [id]);

            const totalSupply = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, totalSupplySelector, totalSupplyArg);

            expect(balanceOf).to.equal(amountMint - amountBurn);
            expect(totalSupply).to.equal(amountMint - amountBurn);
        });

        it("should transfer fractions and update balanceOf", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const transferSelector = IFungibleFractionsOperations.getFunction("transferFrom").selector;
            const balanceOfSelector = IFungibleFractionsOperations.getFunction("balanceOf").selector;

            const amountMint = ethers.parseEther("100");
            const amountTransfer = ethers.parseEther("75");

            const id = 1;

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amountMint]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);

            const transferArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "address", "uint256", "uint256"], [user2.address, user1.address, id, amountTransfer]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, transferSelector, transferArg);
        
            const balanceOfArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [user2.address, id]);
            const balanceOfArg2 = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256"], [user1.address, id]);

            const balanceOf = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg);
            const balanceOf2 = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg2);

            expect(balanceOf).to.equal(amountMint - amountTransfer);
            expect(balanceOf2).to.equal(amountTransfer);
        });

        it("balance of batch accounts should be updated after batch transfer", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const transferSelector = IFungibleFractionsOperations.getFunction("batchTransferFrom").selector;
            const balanceOfSelector = IFungibleFractionsOperations.getFunction("balanceOfBatchAccounts").selector;

            const amountMint1 = ethers.parseEther("100");
            const amountMint2 = ethers.parseEther("50");
            const amountTransfer1 = ethers.parseEther("75");
            const amountTransfer2 = ethers.parseEther("25");

            const id1 = 1;
            const id2 = 2;

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id1, amountMint1]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);

            const mintArg2 = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id2, amountMint2]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg2);

            const transferArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "address", "uint256[]", "uint256[]"], [user2.address, user1.address, [id1, id2], [amountTransfer1, amountTransfer2]]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, transferSelector, transferArg);
        
            const balanceOfArg = ethers.AbiCoder.defaultAbiCoder().encode(["address[]", "uint256[]"], [[user2.address, user2.address, user1.address, user1.address], [id1, id2, id1, id2]]);

            const balanceOfEncoded = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, balanceOfSelector, balanceOfArg);
            const balanceOf = ethers.AbiCoder.defaultAbiCoder().decode(["uint256[]"], balanceOfEncoded)[0];

            expect(balanceOf[0]).to.equal(amountMint1 - amountTransfer1);
            expect(balanceOf[1]).to.equal(amountMint2 - amountTransfer2);
            expect(balanceOf[2]).to.equal(amountTransfer1);
            expect(balanceOf[3]).to.equal(amountTransfer2);
        });

        it("revert: cannot pass data in total supply all", async function () {
            const totalSupplyAllSelector = IFungibleFractionsOperations.getFunction("totalSupplyAll").selector;

            const totalSupplyAllArg = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [1]);

            await expect(
                DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, totalSupplyAllSelector, totalSupplyAllArg)
            ).to.be.revertedWithCustomError(MinimalisticFungibleFractionsDO, "WrongOperationArguments");
        });

        it("total supply all should be updated after mints", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const totalSupplySelector = IFungibleFractionsOperations.getFunction("totalSupplyAll").selector;

            const amountMint1 = ethers.parseEther("100");
            const amountMint2 = ethers.parseEther("50");

            const id1 = 1;
            const id2 = 2;

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id1, amountMint1]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);

            const mintArg2 = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id2, amountMint2]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg2);
        
            const totalSupply = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, totalSupplySelector, "0x");

            expect(totalSupply).to.equal(amountMint1 + amountMint2);
        });

        it("exists should return true after mint", async function () {
            const mintSelector = IFungibleFractionsOperations.getFunction("mint").selector;
            const existsSelector = IFungibleFractionsOperations.getFunction("exists").selector;

            const amountMint = ethers.parseEther("100");

            const id = 1;

            const existsArg = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [id]);

            const existsBeforeEncode = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, existsSelector, existsArg);
            const existsBefore = ethers.AbiCoder.defaultAbiCoder().decode(["bool"], existsBeforeEncode)[0];

            expect(existsBefore).to.equal(false);

            const mintArg = ethers.AbiCoder.defaultAbiCoder().encode(["address", "uint256", "uint256"], [user2.address, id, amountMint]);

            await DataIndex.connect(user1).getFunction("write")(await MinimalisticFungibleFractionsDO.getAddress(), dp, mintSelector, mintArg);
        
            const existsAfterEncoded = await DataIndex.connect(user1).getFunction("read")(await MinimalisticFungibleFractionsDO.getAddress(), dp, existsSelector, existsArg);
            const existsAfter = ethers.AbiCoder.defaultAbiCoder().decode(["bool"], existsAfterEncoded)[0];
            
            expect(existsAfter).to.equal(true);
        });
    });
}
