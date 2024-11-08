// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IDataIndex} from "./interfaces/IDataIndex.sol";
import {IDataObject} from "./interfaces/IDataObject.sol";
import {IIDManager} from "./interfaces/IIDManager.sol";
import {IDataPointRegistry} from "./interfaces/IDataPointRegistry.sol";
import {ChainidTools} from "./utils/ChainidTools.sol";
import {DataPoints, DataPoint} from "./utils/DataPoints.sol";

/**
 * @title Data Index contract
 * @notice Minimalistic implementation of a Data Index contract
 */
contract DataIndex is IDataIndex, AccessControl {
    /// @dev Mask to get the prefix (first 12 bytes) of the diid
    bytes32 internal constant PREFIX_MASK = 0xFFFFFFFFFFFFFFFFFFFFFFFF0000000000000000000000000000000000000000;

    /// @dev Error thrown when the sender is not an admin of the DataPoint
    error InvalidDataPointAdmin(DataPoint dp, address sender);

    /// @dev Error thrown when the DataManager is not approved to interact with the DataPoint
    error DataManagerNotApproved(DataPoint dp, address dm);

    /// @dev Error thrown when the dataIndex identifier is incorrect
    error IncorrectIdentifier(bytes32 diid);

    /**
     * @notice Event emitted when DataManager is approved for DataPoint
     * @param dp Identifier of the DataPoint
     * @param dpAdmin Address of the DataPoint admin who executed the approval change
     * @param dm Address of DataManager
     * @param approved if DataManager is approved
     */
    event DataPointDMApprovalChanged(DataPoint dp, address dpAdmin, address dm, bool approved);

    /**
     * @dev Mapping of DataPoint to DataManagers allowed to write to this DP (in any DataObject)
     * We also store address of the admin who approved the DataManager, so that later, on write(),
     * we can verify it is not revoked
     */
    mapping(DataPoint => mapping(address dm => address dpAdmin)) private _dmApprovals;

    /**
     * @notice Restricts access to the function, allowing only DataPoint admins
     * @param dp DataPoint to check ownership of
     */
    modifier onlyDPAdmin(DataPoint dp) {
        bool isAdmin = _isDataPointAdmin(dp, msg.sender);
        if (!isAdmin) revert InvalidDataPointAdmin(dp, msg.sender);
        _;
    }

    /**
     * @notice Allows access only to DataManagers which was previously approved
     * @param dp DataPoint to check DataManager approval for
     */
    modifier onlyApprovedDM(DataPoint dp) {
        bool approved = isApprovedDataManager(dp, msg.sender);
        if (!approved) revert DataManagerNotApproved(dp, msg.sender);
        _;
    }

    /// @dev Sets the default admin role
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    ///@inheritdoc IDataIndex
    function isApprovedDataManager(DataPoint dp, address dm) public view returns (bool) {
        address dpAdmin = _dmApprovals[dp][dm];
        if (dpAdmin == address(0)) return false;
        // Here we are verifying that address who approved DataManager is still an admin of the DataPoint
        return _isDataPointAdmin(dp, dpAdmin);
    }

    ///@inheritdoc IDataIndex
    function allowDataManager(DataPoint dp, address dm, bool approved) external onlyDPAdmin(dp) {
        if (approved) {
            _dmApprovals[dp][dm] = msg.sender;
        } else {
            delete _dmApprovals[dp][dm];
        }
        emit DataPointDMApprovalChanged(dp, msg.sender, dm, approved);
    }

    ///@inheritdoc IDataIndex
    function read(IDataObject dobj, DataPoint dp, bytes4 operation, bytes calldata data) external view returns (bytes memory) {
        return dobj.read(dp, operation, data);
    }

    ///@inheritdoc IDataIndex
    function write(IDataObject dobj, DataPoint dp, bytes4 operation, bytes calldata data) external onlyApprovedDM(dp) returns (bytes memory) {
        return dobj.write(dp, operation, data);
    }

    ///@inheritdoc IIDManager
    function diid(address account, DataPoint) external pure returns (bytes32) {
        return bytes32(uint256(uint160(account)));
    }

    ///@inheritdoc IIDManager
    function ownerOf(bytes32 diid_) external view returns (uint32, address) {
        if (diid_ & PREFIX_MASK != 0) revert IncorrectIdentifier(diid_); // Require first 12 bytes empty, leaving only 20 bytes of address non-empty
        address account = address(uint160(uint256(diid_)));
        if (account == address(0)) revert IncorrectIdentifier(diid_);
        return (ChainidTools.chainid(), account);
    }

    function _isDataPointAdmin(DataPoint dp, address account) internal view returns (bool) {
        (uint32 chainId, address registry, ) = DataPoints.decode(dp);
        ChainidTools.requireCurrentChain(chainId);
        return IDataPointRegistry(registry).isAdmin(dp, account);
    }
}
