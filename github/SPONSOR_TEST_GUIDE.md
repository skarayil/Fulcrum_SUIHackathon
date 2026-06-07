# Sponsor Dashboard Test Guide

## Test Preparation

### 1. Sponsor Wallet Address
Test wallet registered as sponsor:
- **Email:** f4kpss1907@gmail.com
- **Address:** `0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623`

### 2. Finding SponsorCap Object ID

To find your SponsorCap ID, follow these steps:

**Method 1: Sui Explorer**
1. Go to https://suiexplorer.com/ (testnet should be selected)
2. Paste your wallet address in the search box
3. Look for an object of type `SponsorCap` in the "Owned Objects" section
4. Copy the Object ID

**Method 2: Using Terminal**
```bash
sui client objects --json | grep -A 5 "SponsorCap"
```

### 3. Test Scenario

#### Step 1: Create Competition
1. Go to "Create Competition" tab in Dashboard
2. Fill in **SponsorCap Object ID** field
3. Enter **Competition Rules** (e.g., "Blockchain hackathon - build a DeFi app")
4. Set **Prize Amount** (e.g., 1000000000 = 1 SUI)
5. Add **Jury Member Addresses**:
   ```
   0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9
   0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab
   ```
6. Click "Create Competition" button
7. Approve transaction in wallet
8. **Save the Competition ID!** (will appear in message)

#### Step 2: Create Teams
1. Go to "Create Teams" tab
2. Enter **Competition ID** (from previous step)
3. Enter **Team Configurations**:
   ```
   0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623,0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9,0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab
   ```
   *(First address = team leader)*
4. Click "Create Teams" button
5. Approve transaction in wallet

#### Step 3: Distribute Prizes
1. Go to "Distribute Prizes" tab
2. Enter **Competition ID**
3. Enter **Winning Team ID** (find from explorer)
4. Enter **Winner Addresses**:
   ```
   0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623
   0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
   ```
5. Click "Distribute Prizes" button
6. Approve transaction in wallet

### 4. Success Criteria

✅ Competition created successfully and ID received
✅ Teams created successfully
✅ Prizes distributed to winning team members
✅ All UI text is in English
✅ Error messages are clear and helpful

### 5. Other Test Wallets

For testing as Jury/Contestant:
- `0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416` (sudenazzehirr)
- `0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9` (sudekaray)
- `0xa55f4ccfe3d683fa133753ba40e9afea3ea865c280804d6aba6242b1ebfdc5ab` (ecolo42)
- `0x1c3e6d51b6d127015f7b3e48118ae30e40b00df311e8b0ddb5c20a92e43ad886` (sudenazky7)

## Notes
- Every transaction occurs on the blockchain and requires gas fees
- You need to enter SponsorCap ID each time (for security)
- Don't forget to note down Competition and Team IDs
- You can track transactions on the explorer

## Troubleshooting

**Issue:** "Please fill in all required fields"
**Solution:** Make sure you've filled all fields including SponsorCap ID

**Issue:** "Error: Coin balance not enough"
**Solution:** Make sure you have enough SUI test tokens in your wallet

**Issue:** "Error: Object not found"
**Solution:** Check that Object IDs are correct and on testnet
