import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {ERC1155DataManagerParameters} from "../utils/constants";
import {ethers} from "hardhat";

const contractName = "MinimalisticERC1155WithERC20FractionsDataManager";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts} = hre;
    const {deployer} = await getNamedAccounts();
    const {deploy} = deployments;

    console.log(`\n\nBlockchain DataIndex Contracts - Deploy ${contractName}`);

    console.log(`deployer: ${deployer}`);

    console.log(`\nDeploying ${contractName}...`);

    // Get the necessary contracts
    let dataIndex;
    let MinimalisticFungibleFractionsDO;
    let MinimalisticERC20FractionDataManagerFactory;

    try {
        dataIndex = await ethers.getContract("DataIndex");
        MinimalisticFungibleFractionsDO = await ethers.getContract("MinimalisticFungibleFractionsDO");
        MinimalisticERC20FractionDataManagerFactory = await ethers.getContract("MinimalisticERC20FractionDataManagerFactory");
    } catch (e) {
        console.error("Error getting contracts from deployments");
        console.error(e);
        return false;
    }

    const result = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        args: [
            ERC1155DataManagerParameters.datapoint,
            await dataIndex.getAddress(),
            await MinimalisticFungibleFractionsDO.getAddress(),
            await MinimalisticERC20FractionDataManagerFactory.getAddress(),
            ERC1155DataManagerParameters.name,
            ERC1155DataManagerParameters.symbol,
        ],
        log: true,
        nonce: "pending",
        waitConfirmations: 1,
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });

    console.log(`Contract: ${contractName} deployed at ${result.address}`);

    return true;
};

export default func;
func.id = contractName;
func.tags = [contractName];
