// src/config/constants.ts

/**
 * fulcrum Competition dApp Configuration
 * Contains package ID, module name, and capability IDs for the competition contract
 */

// ========== NEW COMPETITION CONTRACT ==========

// Package ID for fulcrum::competition module (with ContestantRegistry)
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || "";

// ContestantRegistry shared object ID
export const CONTESTANT_REGISTRY_ID = import.meta.env.VITE_REGISTRY_ID || "";

// Module Name
export const MODULE_NAME = "competition";

// DeveloperCap ID (Only for contract deployer - used in DeveloperDashboard)
export const DEVELOPER_CAP_ID = import.meta.env.VITE_DEVELOPER_CAP_ID || "";

// UpgradeCap ID (For contract upgrades)
export const UPGRADE_CAP_ID = import.meta.env.VITE_UPGRADE_CAP_ID || "";

// Reward Registry ID (Shared object for minting custom coins)
export const REWARD_REGISTRY_ID = import.meta.env.VITE_REWARD_REGISTRY_ID || "";

// Developer Wallet Address (Automatically gets developer role)
export const DEVELOPER_ADDRESS = import.meta.env.VITE_DEVELOPER_ADDRESS || "";

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
