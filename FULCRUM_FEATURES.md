# Fulcrum Competition dApp - New Features

This documentation explains the new features added to your Sui dApp project.

## 🚀 New Features

### 1. Move Smart Contract (`fulcrum::competition`)

#### Data Structures:
- **DeveloperCap**: Administrator authority (given to deployer)
- **SponsorCap**: Sponsor role
- **ContestantCap**: Contestant role
- **Competition**: Competition information (rules, prize pool, teams)
- **Team**: Team members and leader information
- **Vote**: Voting mechanism

#### Functions:

**Developer (Administrator) Functions:**
- `assign_role()`: Assigns sponsor or contestant role to users

**Sponsor Functions:**
- `create_competition()`: Creates new competition, locks prize
- `create_teams()`: Divides contestants into teams, determines leaders
- `distribute_prizes()`: Distributes prizes to winning team

**Contestant Functions:**
- `initiate_vote()`: Team leader initiates voting
- `cast_vote()`: Contestants cast votes
- `close_vote()`: Closes voting

### 2. Frontend Pages

#### Developer Dashboard (`/developer-dashboard`)
- **Access**: Only DeveloperCap owners
- **Features**:
  - Assign role to user address
  - Select Sponsor or Contestant role
  - Execute role assignment

#### New Sponsor Dashboard (`/new-sponsor-dashboard`)
- **Access**: Only SponsorCap owners
- **Features**:
  - Create new competition
  - Define competition rules, prize amount, jury members
  - Create teams (organize contestants into groups)
  - Distribute prizes

#### Contestant Dashboard (`/contestant`)
- **Access**: Only ContestantCap owners
- **Features**:
  - View team information
  - Initiate voting if team leader
  - Vote on active polls

## 📦 Installation Steps

### 1. Deploy Smart Contract

```bash
cd blockedy
sui client publish --gas-budget 100000000
```

After deployment, save the **Package ID** you received in the `src/config/constants.ts` file:

```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID_HERE";
```

### 2. Save DeveloperCap Object ID

After deployment, take the **DeveloperCap** object ID that was transferred and write it to the `developerCapId` variable in the `src/pages/DeveloperDashboard.tsx` file:

```typescript
const developerCapId = "YOUR_DEVELOPER_CAP_OBJECT_ID";
```

### 3. Role Assignment

1. Go to `/developer-dashboard` page
2. Enter user wallet address
3. Select Sponsor or Contestant role
4. Click "Assign Role" button

You will need to update the **SponsorCap** or **ContestantCap** object IDs assigned to each user in the relevant pages (`NewSponsorDashboard.tsx` and `ContestantDashboard.tsx`).

## 🔧 Usage

### As Sponsor:

1. Go to `/new-sponsor-dashboard` page
2. In **Create Competition** section:
   - Enter competition rules
   - Set prize amount (SUI)
   - Add jury member addresses
3. In **Create Teams** section:
   - Enter competition ID
   - One team per line, separate contestant addresses with commas
4. In **Distribute Prize** section:
   - Enter competition ID and winning team ID
   - Add winner addresses

### As Contestant:

1. Go to `/contestant` page
2. Click **Load Team Information** button
3. If you are team leader:
   - Enter voting question and options
   - Click "Initiate Voting" button
4. To vote:
   - Enter voting ID
   - Enter your choice number (0, 1, 2...)
   - Click "Cast Vote" button

## 📝 Notes

- All addresses must start with `0x`
- Prize amounts are entered in SUI (1 SUI = 1,000,000,000 MIST)
- Object IDs can be obtained by querying the blockchain or from transaction results
- Use Sui Testnet for testing

## 🔗 Routes

- `/` - Home page (Landing Page)
- `/developer-dashboard` - Administrator panel
- `/new-sponsor-dashboard` - Sponsor panel
- `/contestant` - Contestant panel
- `/sponsor-dashboard` - Old sponsor panel (preserved)

## 🛠 Development

Project structure:
```
blockedy/
  sources/
    blockedy.move          # New competition module
src/
  pages/
    DeveloperDashboard.tsx      # Administrator panel
    NewSponsorDashboard.tsx     # Sponsor panel
    ContestantDashboard.tsx     # Contestant panel
  config/
    constants.ts                # Package ID and other constants
```

## 📚 Move Module Features

- **Role-based access control**: DeveloperCap, SponsorCap, ContestantCap
- **Competition management**: Creation, team assignment, prize distribution
- **Voting system**: Team leaders initiate voting, members vote
- **Prize pool**: SUI coins held securely within the contract
- **Team management**: Automatic leader assignment, member list

## 🎯 Next Steps

1. Deploy contract on testnet
2. Assign sponsor and contestant roles to yourself using DeveloperCap
3. Create test competition
4. Organize teams
5. Test voting system
6. Execute prize distribution

## ⚠️ Important

- Perform security audit before using in production
- Never share your private keys
- Test on testnet
- Remember to update object IDs after each deployment
