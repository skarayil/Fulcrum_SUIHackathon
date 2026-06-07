# Sponsor Dashboard Test Guide

## Test Preparation

### 1. Sponsor Wallet Address
Wallet registered as a sponsor for testing:
- **Email:** f4kpss1907@gmail.com
- **Address:** `0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623`

### 2. Finding the SponsorCap Object ID

Follow the steps below to find your SponsorCap ID:

**Method 1: Sui Explorer**
1. Go to https://suiexplorer.com/ (testnet should be selected)
2. Paste your wallet address into the search box
3. Look for an object of type `SponsorCap` in the "Owned Objects" section
4. Copy the Object ID

**Method 2: Via Terminal**
```bash
sui client objects --json | grep -A 5 "SponsorCap"
```

### 3. Test Scenario

#### Step 1: Create Competition
1. Go to the "Create Competition" tab on the Dashboard
2. Fill in the **SponsorCap Object ID** field
3. Enter **Competition Rules** (e.g., "Blockchain hackathon - build a DeFi app")
4. Set the **Prize Amount** (e.g., 1000000000 = 1 SUI)
5. Add **Jury Member Addresses**:
   ```
   0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9
   0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab
   ```
6. Click the "Create Competition" button
7. Approve the transaction in the wallet
8. **Save the Competition ID!** (it will appear in the message)

#### Step 2: Create Teams
1. Go to the "Create Teams" tab
2. Enter the **Competition ID** (from the previous step)
3. Enter **Team Configurations**:
   ```
   0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623,0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9,0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab
   ```
   *(First address = team leader)*
4. Click the "Create Teams" button
5. Approve the transaction in the wallet

#### Step 3: Distribute Prizes
1. Go to the "Distribute Prizes" tab
2. Enter the **Competition ID**
3. Enter the **Winning Team ID** (find it on the explorer)
4. Enter **Winner Addresses**:
   ```
   0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623
   0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   ```
5. Click the "Distribute Prizes" button
6. Approve the transaction in the wallet

### 4. Success Criteria

✅ Competition successfully created and ID obtained
✅ Teams successfully created
✅ Prizes distributed to the winning team members
✅ All UI texts are in English
✅ Error messages are clear and helpful

### 5. Other Test Wallets

For testing as a Jury/Contestant:
- `0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416` (sudenazzehirr)
- `0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9` (sudekaray)
- `0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab` (ecolo42)
- `0x1c3e6d51b6d127015f7b3e48118ae30e40b00df311e8b0ddb5c20a92e43ad886` (sudenazky7)

## Notes
- Every transaction takes place on the blockchain and requires a gas fee
- The SponsorCap ID needs to be entered each time (for security)
- Don't forget to note down the Competition and Team IDs
- You can track transactions on the Explorer

## Troubleshooting

**Problem:** "Please fill in all required fields"
**Solution:** Make sure you have filled in all fields, including the SponsorCap ID

**Problem:** "Error: Coin balance not enough"
**Solution:** Make sure you have enough SUI test tokens in your wallet

**Problem:** "Error: Object not found"
**Solution:** Check that the Object IDs are correct and on the testnet
