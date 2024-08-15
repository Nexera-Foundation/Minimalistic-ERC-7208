import {deployments, ethers} from "hardhat";
import DataIndex from "./DataIndex.spec";
import DataPointRegistry from "./DataPointRegistry.spec";
import MinimalisticFungibleFractionsDO from "./MinimalisticFungibleFractionsDO.spec";
import MinimalisticERC1155WithERC20FractionsDataManager from "./MinimalisticERC1155WithERC20FractionsDataManager.spec";

describe("Minimalistic testing", function () {
    before(async function () {
        // Deploy Contracts
        await deployments.fixture(
            [
                "DataIndex",
                "DataPointRegistry",
                "MinimalisticFungibleFractionsDO",
                "MinimalisticERC20FractionDataManagerFactory",
            ], {keepExistingDeployments: true}
        );

        this.DataIndex = await ethers.getContract("DataIndex");
        this.DataPointRegistry = await ethers.getContract("DataPointRegistry");
        this.MinimalisticFungibleFractionsDO = await ethers.getContract("MinimalisticFungibleFractionsDO");
        this.MinimalisticERC20FractionDataManagerFactory = await ethers.getContract("MinimalisticERC20FractionDataManagerFactory");

        // Get Signers (with addresses)
        const signers = await ethers.getSigners();

        this.adminSigner = signers[0];
        this.user1 = signers[1];
        this.user2 = signers[2];
    });

    describe("DataIndex tests", DataIndex.bind(this));
    describe("DataPointRegistry tests", DataPointRegistry.bind(this));
    describe("MinimalisticFungibleFractionsDO tests", MinimalisticFungibleFractionsDO.bind(this));
    describe("MinimalisticERC1155WithERC20FractionsDataManager tests", MinimalisticERC1155WithERC20FractionsDataManager.bind(this));
});

export default "";
