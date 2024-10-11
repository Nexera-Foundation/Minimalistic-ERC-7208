import {ethers} from "hardhat";
import {Contract} from "ethers";

async function main() {
    // Get the ERC1155 contract instance
    const MinimalisticERC1155WithERC20FractionsDataManager: Contract = await ethers.getContract("MinimalisticERC1155WithERC20FractionsDataManager");

    // Define the token ID for which to get the ERC20 contract address
    const tokenId: number = 1;

    // Access the fractionManagersById mapping to get the ERC20 contract address for the given tokenId
    const erc20ContractAddress: string = await MinimalisticERC1155WithERC20FractionsDataManager.fractionManagersById(tokenId);
    console.log(`ERC20 contract address for token ID ${tokenId}: ${erc20ContractAddress}`);

    // Check if the address is valid (not the zero address)
    if (!erc20ContractAddress) {
        console.error("No ERC20 contract is associated with this token ID.");
        return;
    }

    // Get the MinimalisticERC20FractionDataManager contract instance at the retrieved address
    const MinimalisticERC20FractionDataManager = await ethers.getContractAt("MinimalisticERC20FractionDataManager", erc20ContractAddress);

    // Define the account address to check the balance of
    const userAddress = ethers.Wallet.fromPhrase(process.env.MNEMONIC!).connect(ethers.provider).address;

    // Call the balanceOf method on the ERC20 contract
    const balance = await MinimalisticERC20FractionDataManager.balanceOf(userAddress);
    console.log(`Balance of account ${userAddress} for token ID ${tokenId}: ${balance.toString()}`);
}

// Execute the script
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
