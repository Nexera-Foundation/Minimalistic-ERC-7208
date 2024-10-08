import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function main() {
  // Get the contract instance
  const MinimalisticERC1155WithERC20FractionsDataManager: Contract = await ethers.getContract(
    "MinimalisticERC1155WithERC20FractionsDataManager",
  );

  // Define recipient, token ID, and amount to mint
  const userAddress = ethers.Wallet.fromPhrase(process.env.MNEMONIC!).connect(ethers.provider).address;
  const tokenId: number = 1; // Token ID you want to mint
  const amount: number = 10; // Number of tokens you want to mint
  const data: string = "0x"; // Additional data, can be "0x" if not needed

  // Get the recipient's balance before minting
  const prevBalance = await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(userAddress, tokenId);
  console.log(`The balance of token ID ${tokenId} for ${userAddress} is ${prevBalance.toString()}`);

  // Call the mint function
  console.log(`Minting ${amount} tokens of type ${tokenId} to address ${userAddress}`);
  const txMint = await MinimalisticERC1155WithERC20FractionsDataManager.mint(userAddress, tokenId, amount, data);
  await txMint.wait();
  console.log(`Mint completed. Transaction hash: ${txMint.hash}`);

  // Get the recipient's balance
  const balance = await MinimalisticERC1155WithERC20FractionsDataManager.balanceOf(userAddress, tokenId);
  console.log(`The balance of token ID ${tokenId} for ${userAddress} is ${balance.toString()}`);
}

// Execute the script
main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
