import {ethers} from "hardhat";
import {ERC1155DataManagerParameters} from "../utils/constants";

// command to execute script:
// npx hardhat run ./scripts/setUpDataManager.ts --network <network name>

export async function main() {
    const dp = ERC1155DataManagerParameters.datapoint;

    if (!dp) {
        console.error("Data point not set");
        return false;
    }

    let DataIndex;
    let DataPointRegistry;
    let MinimalisticFungibleFractionsDO;
    let MinimalisticERC1155WithERC20FractionsDataManager;

    // Get contracts
    try {
        DataIndex = await ethers.getContract("DataIndex");
        DataPointRegistry = await ethers.getContract("DataPointRegistry");
        MinimalisticFungibleFractionsDO = await ethers.getContract("MinimalisticFungibleFractionsDO");
        MinimalisticERC1155WithERC20FractionsDataManager = await ethers.getContract("MinimalisticERC1155WithERC20FractionsDataManager");
    } catch (e) {
        console.error("Error getting contracts from deployments");
        console.error(e);
        return false;
    }

    // Allow data manager
    let tx = await DataIndex.getFunction("allowDataManager")(dp, await MinimalisticERC1155WithERC20FractionsDataManager.getAddress(), true);
    await tx.wait();

    // Transfer ownership
    tx = await DataPointRegistry.getFunction("grantAdminRole")(dp, await MinimalisticERC1155WithERC20FractionsDataManager.getAddress());
    await tx.wait();

    // Set data index implementation
    tx = await MinimalisticFungibleFractionsDO.getFunction("setDataIndexImplementation")(dp, await DataIndex.getAddress());
    await tx.wait();

    console.log("Data manager set up for data point: ", dp);
}

main();
