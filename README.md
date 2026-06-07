# FULCRUM - Decentralized Hackathon & Competition Platform

Fulcrum is a decentralized application (dApp) built on the Sui blockchain that facilitates transparent hackathons and competitions. It features sponsor and contestant registration, team formation, jury voting, and an automated prize distribution mechanism using a custom token (`REWARD`).

This project was built during a hackathon and has been modernized to run locally on Sui Localnet or on the Sui Testnet, utilizing the latest `@mysten/sui` SDK.

---

## 🏗 System Architecture

*   **Smart Contracts (Move)**: Handles competition logic, role assignments, team creation, voting, and the custom `REWARD` coin minting and prize distribution.
*   **Frontend**: React + Vite application using `@radix-ui/themes` for UI and `@mysten/dapp-kit` for wallet connections and Programmable Transaction Blocks (PTBs).
*   **Backend/Database**: **None**. This project is fully decentralized. All data (competitions, teams, contestants, votes) is stored directly on the Sui blockchain and queried dynamically by the frontend.

---

## 🛠 Prerequisites

Ensure you have the following installed before proceeding:

1.  [Node.js](https://nodejs.org/en/) (v18 or newer)
2.  [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (Must be installed to compile and deploy Move contracts)
3.  A Sui-compatible wallet extension (e.g., [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgkpjkbamceippoeakobhkofmifgmb))

---

## 🚀 Step 1: Running the Sui Localnet (Optional, for Local Testing)

If you want to test the application locally without relying on the Testnet, you need to spin up a local Sui network.

1.  Open a new terminal window.
2.  Start the local network and a local faucet:
    ```bash
    sui-test-validator
    ```
    *(Leave this terminal running in the background).*
3.  Configure your Sui CLI to use the local environment (if not already set up):
    ```bash
    sui client new-env --alias localnet --rpc http://127.0.0.1:9000
    sui client switch --env localnet
    ```
4.  Get some local SUI tokens for deploying the contract:
    ```bash
    sui client faucet
    ```

*Note: If you are using the Sui Testnet, switch your environment to `testnet` instead.*

---

## 📦 Step 2: Compiling & Deploying the Smart Contract

The smart contract must be deployed before the frontend can interact with it.

1.  Navigate to the `blockchain` directory containing the Move package:
    ```bash
    cd blockchain
    ```
2.  Build the project to ensure there are no compilation errors:
    ```bash
    sui move build
    ```
3.  Publish the contract to your active network (Localnet or Testnet):
    ```bash
    sui client publish --gas-budget 100000000
    ```
4.  **Crucial Step - Extracting Object IDs**:
    The terminal output will display a large JSON transaction response. You need to extract specific IDs from the `"objectChanges"` array:
    
    *   **Package ID**: Look for the object with `"type": "published"`. Copy its `"packageId"`.
    *   **ContestantRegistry ID**: Look for the `shared` object of type `[PACKAGE_ID]::competition::ContestantRegistry`. Copy its `"objectId"`.
    *   **RewardRegistry ID**: Look for the `shared` object of type `[PACKAGE_ID]::reward::RewardRegistry`. Copy its `"objectId"`.
    *   **UpgradeCap ID**: Look for the object of type `0x2::package::UpgradeCap`. Copy its `"objectId"`.
    *   **DeveloperCap ID**: Look for the object of type `[PACKAGE_ID]::competition::DeveloperCap`. Copy its `"objectId"`.

---

## ⚙️ Step 3: Frontend Configuration (.env)

The frontend needs to know the addresses of your newly deployed smart contracts.

1.  Navigate to the `frontend` directory (where `package.json` is located):
    ```bash
    cd frontend
    ```
2.  Copy the environment template:
    ```bash
    cp .env.example .env
    ```
3.  Open the `.env` file and paste the IDs you extracted in Step 2:

    ```env
    # .env
    VITE_NETWORK=localnet # or testnet
    
    # Move Package ID
    VITE_PACKAGE_ID=0x...
    
    # Shared Object IDs
    VITE_REGISTRY_ID=0x...
    VITE_REWARD_REGISTRY_ID=0x...
    
    # Capability IDs (Optional for UI rendering)
    VITE_DEVELOPER_CAP_ID=0x...
    VITE_UPGRADE_CAP_ID=0x...
    VITE_DEVELOPER_ADDRESS=0x...
    ```

---

## 🖥 Step 4: Running the Frontend

With the contract deployed and the environment configured, you can now run the web interface.

1.  Install the required dependencies:
    ```bash
    npm install
    ```
2.  Start the Vite development server:
    ```bash
    npm run dev
    ```
3.  Open your browser and navigate to `http://localhost:5173`.

---

## 🎮 How to Test the Application

1.  **Connect Wallet**: Click the connect button in the top right. Ensure your wallet network matches `VITE_NETWORK` (e.g., Localnet).
2.  **Get Tokens**: If you are on Testnet, use the Wallet's built-in faucet. If on Localnet, request tokens via the `sui client faucet` command to your wallet address.
3.  **Contestant Flow**:
    *   Navigate to **Contestant Dashboard**.
    *   Register as a Contestant.
4.  **Sponsor Flow**:
    *   Navigate to **Sponsor Dashboard**.
    *   Register as a Sponsor.
    *   Create a competition (Define rules and `REWARD` prize amount). The transaction will automatically mint custom `REWARD` tokens using the Shared `RewardRegistry` and lock them in the competition.
    *   Create teams using the addresses of registered contestants.
    *   Distribute the prize. The UI will extract the team members and split the `REWARD` coins equally among the winners!

Enjoy your fully decentralized Sui dApp!
