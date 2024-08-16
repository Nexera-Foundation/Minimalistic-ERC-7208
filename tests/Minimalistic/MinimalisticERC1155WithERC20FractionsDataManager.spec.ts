/* eslint @typescript-eslint/no-var-requires: "off" */
import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";

export default async function suite(): Promise<void> {
    describe("MinimalisticERC1155WithERC20FractionsDataManager", () => {
        let snap: string;

        let user1: SignerWithAddress;
        let user2: SignerWithAddress;

        let DataIndex: Contract;
        let DataPointRegistry: Contract;

        let MinimalisticFungibleFractionsDO: Contract;

        let MinimalisticERC20FractionDataManagerFactory: Contract;
        
        let MinimalisticERC1155WithERC20FractionsDataManager: Contract;

        let dp: string; // data point

        before(async function () {
            user1 = this.user1;
            user2 = this.user2;

            DataIndex = this.DataIndex;
            DataPointRegistry = this.DataPointRegistry;

            MinimalisticFungibleFractionsDO = this.MinimalisticFungibleFractionsDO;

            MinimalisticERC20FractionDataManagerFactory = this.MinimalisticERC20FractionDataManagerFactory;

            // Set up MinimalisticERC1155WithERC20FractionsDataManager

            // Get dp
            dp = await DataPointRegistry.allocate.staticCall(user1.address);
            await DataPointRegistry.allocate(user1.address);

            // Deploy MinimalisticERC1155WithERC20FractionsDataManager
            const MinimalisticERC1155WithERC20FractionsDataManagerFactory = await ethers.getContractFactory("MinimalisticERC1155WithERC20FractionsDataManager");
            const MinimalisticERC1155WithERC20FractionsDataManagerAddress = await (await MinimalisticERC1155WithERC20FractionsDataManagerFactory.deploy(
                dp,
                await DataIndex.getAddress(),
                await MinimalisticFungibleFractionsDO.getAddress(),
                await MinimalisticERC20FractionDataManagerFactory.getAddress(),
                "TEST",
                "TEST",
            )).getAddress();

            MinimalisticERC1155WithERC20FractionsDataManager = await ethers.getContractAt("MinimalisticERC1155WithERC20FractionsDataManager", MinimalisticERC1155WithERC20FractionsDataManagerAddress) as any;

            // Allow data manager
            await DataIndex.connect(user1).getFunction("allowDataManager")(dp, MinimalisticERC1155WithERC20FractionsDataManagerAddress, true);

            // Transfer ownership
            await DataPointRegistry.connect(user1).getFunction("grantAdminRole")(dp, MinimalisticERC1155WithERC20FractionsDataManagerAddress);
            
            await MinimalisticFungibleFractionsDO.connect(user1).getFunction("setDataIndexImplementation")(dp, await DataIndex.getAddress());
        });

        beforeEach(async function () {
            snap = await ethers.provider.send("evm_snapshot", []);
        });

        afterEach(async function () {
            await ethers.provider.send("evm_revert", [snap]);
        });

        it("check name, symbol and URI", async function () {
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.name()).to.equal("TEST");
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.symbol()).to.equal("TEST");

            await MinimalisticERC1155WithERC20FractionsDataManager.setDefaultURI("URIURI");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.uri(0)).to.equal("URIURI");
        });

        it("should set approval for all", async function () {
            await expect(
                MinimalisticERC1155WithERC20FractionsDataManager.connect(user1).setApprovalForAll(user2.address, true)
            ).to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "ApprovalForAll").withArgs(user1.address, user2.address, true);

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.isApprovedForAll(user1.address, user2.address)).to.equal(true);
        });

        it("revert: only minter (owner) can mint", async function () {
            await expect(
                MinimalisticERC1155WithERC20FractionsDataManager.connect(user2).mint(user1.address, 1, 1000, "0x")
            ).to.be.revertedWithCustomError(MinimalisticERC1155WithERC20FractionsDataManager, "OwnableUnauthorizedAccount");
        });

        it("should mint fractions and update balanceOf and totalSupply", async function () {
            await expect(MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x"))
                .to.emit(DataIndex, "DataPointDMApprovalChanged")
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "ERC20FractionDataManagerDeployed")
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "TransferSingle");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 1)).to.equal(1000);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.getFunction("totalSupply(uint256)")(1)).to.equal(1000);
        });

        it("should burn fractions and update balanceOf and totalSupply", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            await expect(MinimalisticERC1155WithERC20FractionsDataManager.connect(user1).burn(user1.address, 1, 500))
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "TransferSingle");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 1)).to.equal(500);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.getFunction("totalSupply(uint256)")(1)).to.equal(500);
        });

        it("should transfer fractions and update balanceOf", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            await expect(MinimalisticERC1155WithERC20FractionsDataManager.connect(user1).safeTransferFrom(user1.address, user2.address, 1, 750, "0x"))
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "TransferSingle");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 1)).to.equal(250);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user2.address, 1)).to.equal(750);
        });

        it("should transfer fractions and update balanceOf (approve user2 to transfer)", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            await MinimalisticERC1155WithERC20FractionsDataManager.connect(user1).setApprovalForAll(user2.address, true);

            await expect(MinimalisticERC1155WithERC20FractionsDataManager.connect(user2).safeTransferFrom(user1.address, user2.address, 1, 750, "0x"))
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "TransferSingle");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 1)).to.equal(250);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user2.address, 1)).to.equal(750);
        });

        it("balance of batch accounts should be updated after batch transfer", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 2, 500, "0x");

            await expect(MinimalisticERC1155WithERC20FractionsDataManager.connect(user1).safeBatchTransferFrom(user1.address, user2.address, [1, 2], [750, 250], "0x"))
                .to.emit(MinimalisticERC1155WithERC20FractionsDataManager, "TransferBatch");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 1)).to.equal(250);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user2.address, 1)).to.equal(750);

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user1.address, 2)).to.equal(250);
            expect(await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(user2.address, 2)).to.equal(250);
        });

        it("total supply all should be updated after mints", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 2, 500, "0x");

            expect(await MinimalisticERC1155WithERC20FractionsDataManager.getFunction("totalSupply()")()).to.equal(1500);
        });

        // ERC20 Fractions tests

        it("deployed ERC20DM should be initialized correctly", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            const erc20DM = await MinimalisticERC1155WithERC20FractionsDataManager.fractionManagersById(1);

            const MinimalisticERC20FractionDataManager = await ethers.getContractAt("MinimalisticERC20FractionDataManager", erc20DM);

            expect(await MinimalisticERC20FractionDataManager.fungibleFractionsDO()).to.equal(await MinimalisticFungibleFractionsDO.getAddress());
            expect(await MinimalisticERC20FractionDataManager.dataIndex()).to.equal(await DataIndex.getAddress());
            expect(await MinimalisticERC20FractionDataManager.erc1155dm()).to.equal(await MinimalisticERC1155WithERC20FractionsDataManager.getAddress());
            expect(await MinimalisticERC20FractionDataManager.erc1155ID()).to.equal(1);
            expect(await MinimalisticERC20FractionDataManager.name()).to.equal("TEST 1");
            expect(await MinimalisticERC20FractionDataManager.symbol()).to.equal("TEST-1");
        });

        it("should set an approval", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            const erc20DM = await MinimalisticERC1155WithERC20FractionsDataManager.fractionManagersById(1);

            const MinimalisticERC20FractionDataManager = await ethers.getContractAt("MinimalisticERC20FractionDataManager", erc20DM);

            await expect(MinimalisticERC20FractionDataManager.connect(user1).approve(user2.address, 500))
                .to.emit(MinimalisticERC20FractionDataManager, "Approval")
                .withArgs(user1.address, user2.address, 500);

            expect(await MinimalisticERC20FractionDataManager.allowance(user1.address, user2.address)).to.equal(500);
        });

        it("should transfer fractions and update balanceOf", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            const erc20DM = await MinimalisticERC1155WithERC20FractionsDataManager.fractionManagersById(1);

            const MinimalisticERC20FractionDataManager = await ethers.getContractAt("MinimalisticERC20FractionDataManager", erc20DM);

            await MinimalisticERC20FractionDataManager.connect(user1).approve(user2.address, 500);

            await expect(MinimalisticERC20FractionDataManager.connect(user2).transferFrom(user1.address, user2.address, 500))
                .to.emit(MinimalisticERC20FractionDataManager, "Transfer")
                .withArgs(user1.address, user2.address, 500);

            expect(await MinimalisticERC20FractionDataManager.balanceOf(user1.address)).to.equal(500);
            expect(await MinimalisticERC20FractionDataManager.balanceOf(user2.address)).to.equal(500);

            expect(await MinimalisticERC20FractionDataManager.totalSupply()).to.equal(1000);
        });

        it("should transfer fractions and update balanceOf (approve user2 to transfer)", async function () {
            await MinimalisticERC1155WithERC20FractionsDataManager.mint(user1.address, 1, 1000, "0x");

            const erc20DM = await MinimalisticERC1155WithERC20FractionsDataManager.fractionManagersById(1);

            const MinimalisticERC20FractionDataManager = await ethers.getContractAt("MinimalisticERC20FractionDataManager", erc20DM);

            await MinimalisticERC20FractionDataManager.connect(user1).approve(user2.address, 500);

            await expect(MinimalisticERC20FractionDataManager.connect(user2).transferFrom(user1.address, user2.address, 500))
                .to.emit(MinimalisticERC20FractionDataManager, "Transfer")
                .withArgs(user1.address, user2.address, 500);

            expect(await MinimalisticERC20FractionDataManager.balanceOf(user1.address)).to.equal(500);
            expect(await MinimalisticERC20FractionDataManager.balanceOf(user2.address)).to.equal(500);

            expect(await MinimalisticERC20FractionDataManager.totalSupply()).to.equal(1000);

            expect(await MinimalisticERC20FractionDataManager.allowance(user1.address, user2.address)).to.equal(0);
        });
    });
}
