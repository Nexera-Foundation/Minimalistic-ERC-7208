import { ethers } from "hardhat";

// command to execute script:
// npx hardhat run ./scripts/allocateDataPoint.ts --network <network name>

export async function main() {
    const userAddress = (ethers.Wallet.fromPhrase(process.env.MNEMONIC!).connect(ethers.provider)).address;

    let DataPointRegistry;

    // Get contract
    try {
        DataPointRegistry = await ethers.getContract("DataPointRegistry");
    } catch (e) {
        console.error("Error getting contracts from deployments");
        console.error(e);
        return false;
    }

    // Allocate data point
    const dp = await DataPointRegistry.getFunction("allocate").staticCall(userAddress);

    const tx = await DataPointRegistry.getFunction("allocate")(userAddress);
    await tx.wait();

    console.log("DataPoint: ", dp, " allocated to ", userAddress);
}

main();