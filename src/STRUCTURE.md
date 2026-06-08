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
│   ├── DeveloperDashboard.tsx # Developer/Admin panel for role assignment
│   ├── NewSponsorDashboard.tsx # Sponsor panel (create competition, teams, distribute prizes)
│   ├── ContestantDashboard.tsx # Contestant panel (view team info)
│   └── ViewPool.tsx     # View competition pool information
├── components/          # Reusable components
│   ├── FulcrumLogo.tsx  # Logo component
│   ├── PageTransition.tsx # Page transition animations
│   └── ProtectedRoute.tsx # Route protection based on user roles
├── hooks/               # Custom React hooks
│   ├── useContestantRegistrations.ts # Fetch contestant registrations
│   └── useUserRole.ts   # Determine user role from wallet capabilities
├── App.tsx              # Main app component with routing
├── main.tsx             # Entry point
├── index.css            # Global styles
└── vite-env.d.ts        # TypeScript definitions
```

## File Organization

### Pages (`src/pages/`)
All route-based components. Each page is a self-contained component that handles a specific feature.

- **LandingPage.tsx**: Marketing/landing page with registration form
- **DeveloperDashboard.tsx**: Admin panel for assigning roles to users
- **NewSponsorDashboard.tsx**: Sponsor panel for creating competitions, teams, and distributing prizes
- **ContestantDashboard.tsx**: Contestant panel for viewing team information
- **ViewPool.tsx**: View competition pool details and team information

### Components (`src/components/`)
Reusable UI components:
- **FulcrumLogo.tsx**: Brand logo component
- **PageTransition.tsx**: Smooth page transitions
- **ProtectedRoute.tsx**: Route protection based on user roles (developer, sponsor, contestant)

### Hooks (`src/hooks/`)
Custom React hooks for data fetching and state management:
- **useContestantRegistrations.ts**: Fetch registered contestants from blockchain
- **useUserRole.ts**: Determine user role by checking wallet capabilities

### Config (`src/config/`)
Configuration and constants:
- **constants.ts**: Contract addresses, module names, explorer URLs
- **networkConfig.ts**: Sui network configuration (testnet, devnet, mainnet)

### Root Files
- **App.tsx**: Router setup and navigation
- **main.tsx**: Application entry point with providers (SuiClient, Wallet, QueryClient)
- **index.css**: Global Tailwind CSS styles

## Routes

- `/` - Landing page (home)
- `/developer-dashboard` - Developer/admin panel (protected: developer role)
- `/new-sponsor-dashboard` - Sponsor panel (protected: sponsor role)
- `/contestant` - Contestant panel (protected: contestant role)
- `/view-pool` - View competition pool (protected: sponsor role)

## Usage

1. Start development: `npm run dev`
2. Build: `npm run build`
3. Main pages: Use navigation menu based on user role

## Important Notes

- All blockchain interactions use `@mysten/dapp-kit`
- Contract functions are in `fulcrum/sources/fulcrum.move`
- All text content is in English
- Design uses blue/cyan color scheme
- Role-based access control protects routes based on wallet capabilities
