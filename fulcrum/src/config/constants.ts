// src/config/constants.ts

/**
 * Blockedy Competition dApp Configuration
 * Contains package ID, module name, and capability IDs for the competition contract
 */

// ========== NEW COMPETITION CONTRACT ==========

// Package ID for blockedy::competition module (with ContestantRegistry)
export const PACKAGE_ID = "0xca8117c0ceab3bba289363c3de12c676efa272882292bbce8e892550f07d54f6";

// ContestantRegistry shared object ID
export const CONTESTANT_REGISTRY_ID = "0x025c6f22a8fcf17eb897f30fb873cacd3c085c37d8d8e6719a89bfc01b47df6f";

// Module Name
export const MODULE_NAME = "competition";

// DeveloperCap ID (Only for contract deployer - used in DeveloperDashboard)
export const DEVELOPER_CAP_ID = "0x34d24a4163466dc786e7badbe869c766b491a665c0f65632bb4ac7d182266a9b";

// UpgradeCap ID (For contract upgrades)
export const UPGRADE_CAP_ID = "0x7c56f8cd8f78a04f4979afb9da591dea2ba1c951213fc47a091e920250cabab1";

// Developer Wallet Address (Automatically gets developer role)
export const DEVELOPER_ADDRESS = "0xbdbdf0fb5ce7ecace73650119e63f228677e7a0629ced36b30e13d9abcbccb22";

// ========== OLD PRIZE POOL CONTRACT (Legacy) ==========

// Old Package ID
export const OLD_PACKAGE_ID = "0xfb9c1dc6f6226dcc0105dc1ee0c92b0a0d0e5233439eb1df3ec05c00b899b310";

// Old Module Name
export const OLD_MODULE_NAME = "prize_pool";

// Old Admin Cap ID
export const OLD_ADMIN_CAP_ID = "0x7010bb9403ab68943b0b62fcac7b9c3b37473258d88215a0812d2b42df5389be";

// ========== EXPLORER & NETWORK ==========

// Testnet Explorer Link
export const EXPLORER_URL = "https://suiscan.xyz/testnet/tx/";

// Network
export const NETWORK = "testnet";
