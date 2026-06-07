# Blockedy Competition dApp - New Features

This documentation describes the new features added to your Sui dApp project.

## 🚀 New Features

### 1. Move Smart Contract (`blockedy::competition`)

#### Data Structures:
- **DeveloperCap**: Administrator authority (given to the deployer)
- **SponsorCap**: Sponsor role
- **ContestantCap**: Contestant role
- **Competition**: Competition information (rules, prize pool, teams)
- **Team**: Team members and leader information
- **Vote**: Voting mechanism

#### Functions:

**Developer (Admin) Functions:**
- `assign_role()`: Assigns sponsor or contestant roles to users

**Sponsor Functions:**
- `create_competition()`: Creates a new competition, locks the prize
- `create_teams()`: Divides contestants into teams, determines leaders
- `distribute_prizes()`: Distributes prizes to the winning team

**Contestant Functions:**
- `initiate_vote()`: The team leader starts a vote
- `cast_vote()`: Contestants cast their votes
- `close_vote()`: Closes the vote

### 2. Frontend Pages

#### Developer Dashboard (`/developer-dashboard`)
- **Access**: Only DeveloperCap holders
- **Features**:
  - Assign a role to a user address
  - Select Sponsor or Contestant role
  - Role assignment process

#### New Sponsor Dashboard (`/new-sponsor-dashboard`)
- **Access**: Only SponsorCap holders
- **Features**:
  - Create a new competition
  - Define competition rules, prize amount, jury members
  - Create teams (grouping contestants)
  - Distribute prizes

#### Contestant Dashboard (`/contestant-dashboard`)
- **Access**: Only ContestantCap holders
- **Features**:
  - View team information
  - Initiate a vote if you are the team leader
  - Vote in active polls

## 📦 Installation Steps

### 1. Deploy the Smart Contract

```bash
cd blockedy
sui client publish --gas-budget 100000000
```

After deployment, save the **Package ID** you receive in the `src/config/constants.ts` file:

```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID_HERE";
```

### 2. Save the DeveloperCap Object ID

After deployment, take the transferred **DeveloperCap** object ID and write it to the `developerCapId` variable in the `src/pages/DeveloperDashboard.tsx` file:

```typescript
const developerCapId = "YOUR_DEVELOPER_CAP_OBJECT_ID";
```

### 3. Role Assignment

1. Go to the `/developer-dashboard` page
2. Enter the user's wallet address
3. Select the Sponsor or Contestant role
4. Click the "Assign Role" button

You will need to update the **SponsorCap** or **ContestantCap** object IDs assigned to each user on the respective pages (`NewSponsorDashboard.tsx` and `ContestantDashboard.tsx`).

## 🔧 Usage

### As a Sponsor:

1. Go to the `/new-sponsor-dashboard` page
2. In the **Create Competition** section:
   - Enter the competition rules
   - Determine the prize amount (SUI)
   - Add the addresses of the jury members
3. In the **Create Teams** section:
   - Enter the Competition ID
   - One team per line, separate contestant addresses with commas
4. In the **Distribute Prize** section:
   - Enter the Competition ID and the winning team ID
   - Add the winner addresses

### As a Contestant:

1. Go to the `/contestant-dashboard` page
2. Click the **Load Team Info** button
3. If you are the team leader:
   - Enter the voting question and options
   - Click the "Initiate Vote" button
4. To cast a vote:
   - Enter the Vote ID
   - Enter your choice number (0, 1, 2...)
   - Click the "Cast Vote" button

## 📝 Notes

- All addresses must start with `0x`
- Prize amounts are entered in SUI (1 SUI = 1,000,000,000 MIST)
- You can get Object IDs by querying the blockchain or from transaction results
- Use the Sui Testnet for testing

## 🔗 Routes

- `/` - Home page (Landing Page)
- `/developer-dashboard` - Admin panel
- `/new-sponsor-dashboard` - Sponsor panel
- `/contestant-dashboard` - Contestant panel
- `/sponsor-dashboard` - Old sponsor panel (preserved)

## 🛠 Development

Project structure:
```
blockedy/
  sources/
    blockedy.move          # New competition module
src/
  pages/
    DeveloperDashboard.tsx      # Admin panel
    NewSponsorDashboard.tsx     # Sponsor panel
    ContestantDashboard.tsx      # Contestant panel
  config/
    constants.ts                # Package ID and other constants
```

## 📚 Move Module Features

- **Role-based access control**: DeveloperCap, SponsorCap, ContestantCap
- **Competition management**: Creation, team assignment, prize distribution
- **Voting system**: Team leaders initiate votes, members cast votes
- **Prize pool**: SUI coins are held securely within the contract
- **Team management**: Automatic leader assignment, member list

## 🎯 Next Steps

1. Deploy the contract on the testnet
2. Assign yourself sponsor and contestant roles with the DeveloperCap
3. Create a test competition
4. Organize the teams
5. Test the voting system
6. Perform the prize distribution

## ⚠️ Important

- Have a security audit done before using in production
- Never share your private keys
- Test on the testnet
- Do not forget to update the Object IDs after each deployment
