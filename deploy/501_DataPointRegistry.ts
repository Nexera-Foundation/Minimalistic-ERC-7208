import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";

const contractName = "DataPointRegistry";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts} = hre;
    const {deployer} = await getNamedAccounts();
    const {deploy} = deployments;

    console.log(`\n\nBlockchain DataIndex Contracts - Deploy ${contractName}`);

    console.log(`deployer: ${deployer}`);

    console.log(`\nDeploying ${contractName}...`);

    const result = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        log: true,
        proxy: {
            owner: deployer,
            proxyContract: "OptimizedTransparentProxy",
        },
        waitConfirmations: 1,
        nonce: "pending",
        autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });

    console.log(`Contract: ${contractName} deployed at ${result.address}`);

    return true;
};

export default func;
func.id = contractName;
func.tags = [contractName];
func.dependencies = ["DataIndex"];