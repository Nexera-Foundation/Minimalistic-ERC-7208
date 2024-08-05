import {ethers} from "hardhat";
import DataIndex from "./DataIndex.spec";
import DataPointRegistry from "./DataPointRegistry.spec";
import MinimalisticFungibleFractionsDO from "./MinimalisticFungibleFractionsDO.spec";
import MinimalisticERC1155WithERC20FractionsDataManager from "./MinimalisticERC1155WithERC20FractionsDataManager.spec";

describe("Minimalistic testing", function () {
    before(async function () {
        // Deploy Contracts
        const DataIndexFactory = await ethers.getContractFactory("DataIndex");
        const DataIndexAddress = await (await DataIndexFactory.deploy()).getAddress();

        this.DataIndex = await ethers.getContractAt("DataIndex", DataIndexAddress);

        const DataPointRegistryFactory = await ethers.getContractFactory("DataPointRegistry");
        const DataPointRegistryAddress = await (await DataPointRegistryFactory.deploy()).getAddress();

        this.DataPointRegistry = await ethers.getContractAt("DataPointRegistry", DataPointRegistryAddress);

        const MinimalisticFungibleFractionsDOFactory = await ethers.getContractFactory("MinimalisticFungibleFractionsDO");
        const MinimalisticFungibleFractionsDOAddress = await (await MinimalisticFungibleFractionsDOFactory.deploy()).getAddress();

        this.MinimalisticFungibleFractionsDO = await ethers.getContractAt("MinimalisticFungibleFractionsDO", MinimalisticFungibleFractionsDOAddress);

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
