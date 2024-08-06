// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {MinimalisticERC20FractionDataManager} from "./MinimalisticERC20FractionDataManager.sol";

/**
 * @title Minimalistic ERC20 Fraction Data Manager Factory
 * @dev Factory contract to deploy MinimalisticERC20FractionDataManager contracts
 *      This contract does not have any access control on who can deploy new contracts
 */
contract MinimalisticERC20FractionDataManagerFactory {
    /**
     * @dev Deploys a new MinimalisticERC20FractionDataManager contract
     * @param id The id of the contract
     * @return The address of the deployed contract
     * @dev The address of the deployed contract is deterministic based on the sender and id
     */
    function deploy(uint256 id) external returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, id));
        return Create2.deploy(0, salt, type(MinimalisticERC20FractionDataManager).creationCode);
    }
}
