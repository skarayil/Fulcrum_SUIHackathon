# Project Structure

## Overview
This is a Sui blockchain-based dApp for fair prize distribution in hackathons.

## Directory Structure

```
src/
├── config/              # Configuration files
│   ├── constants.ts     # Contract constants (PACKAGE_ID, MODULE_NAME, etc.)
│   └── networkConfig.ts # Sui network configuration
├── pages/               # Page components (routes)
│   ├── LandingPage.tsx  # Home/landing page
│   ├── DApp.tsx         # Main dApp interface (all functions)
│   ├── SponsorDashboard.tsx # Create prize pool
│   ├── CreateTeam.tsx   # Create team
│   ├── Kick.tsx         # Kick member functionality
│   ├── About.tsx        # About page
│   ├── JuryVoting.tsx   # Jury voting page
│   ├── ClaimPrize.tsx   # Claim prize page
│   ├── DistributePrize.tsx # Distribute prize page
│   ├── ViewPool.tsx     # View pool information
│   └── InitializeVotes.tsx # Initialize votes page
├── App.tsx              # Main app component with routing
├── main.tsx             # Entry point
├── index.css            # Global styles
└── vite-env.d.ts        # TypeScript definitions
```

## File Organization

### Pages (`src/pages/`)
All route-based components. Each page is a self-contained component that handles a specific feature.

- **LandingPage.tsx**: Marketing/landing page
- **DApp.tsx**: Main dApp interface with all blockchain functions in one place
- Individual feature pages: Each handles a specific contract function

### Config (`src/config/`)
Configuration and constants:
- **constants.ts**: Contract addresses, module names, explorer URLs
- **networkConfig.ts**: Sui network configuration (testnet, devnet, mainnet)

### Root Files
- **App.tsx**: Router setup and navigation
- **main.tsx**: Application entry point with providers
- **index.css**: Global Tailwind CSS styles

## Usage

1. Start development: `npm run dev`
2. Build: `npm run build`
3. Main dApp interface: Navigate to `/dapp`
4. Individual pages: Use navigation menu

## Important Notes

- All blockchain interactions use `@mysten/dapp-kit`
- Contract functions are in `blockedy/sources/blockedy.move`
- All text content is in English
- Design uses blue/cyan color scheme

