# Sponsor Registration and Test Guide

## Step 1: Register as Sponsor

### Wallet Information
- **Email:** f4kpss1907@gmail.com
- **Wallet:** 0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623

### Registration Process

1. **Go to Home Page**
   - In browser: http://localhost:5173
   - You will be redirected to home page

2. **Find "Join the Community" Form**
   - Scroll down the page
   - See the form titled "Join the Community"

3. **Fill the Form**
   - **Name:** Any name (e.g., "F4 Sponsor")
   - **Email:** f4kpss1907@gmail.com
   - **Role:** Select **"Sponsor"** from dropdown
   - **Message:** Optional (e.g., "Test sponsor registration")

4. **Submit and Approve**
   - Click "Register" button
   - Wallet popup will open
   - Approve the transaction
   - Wait until transaction completes

5. **Get Your SponsorCap ID**
   - After transaction is successful:
   - Go to Explorer: https://suiexplorer.com/?network=testnet
   - Search wallet address: 0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623
   - In "Assets" section you will now see **2 items**
   - Find **SponsorCap** object
   - Copy the Object ID (e.g., 0xca53...f0763)

## Step 2: Test Sponsor Dashboard

1. **Go to Dashboard**
   - URL: http://localhost:5173/new-sponsor-dashboard
   - Or click "Sponsor" button from top menu

2. **Enter SponsorCap ID**
   - In first card there is "Your SponsorCap Object ID" field
   - Paste the Object ID you copied

3. **Create Competition**
   - In "Create Competition" tab:
   - Rules: "Blockchain hackathon test"
   - Prize Amount: 1000000000 (1 SUI)
   - Jury Addresses:
     ```
     0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
     0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9
     ```
   - Click "Create Competition" button
   - Approve in wallet
   - Note the Competition ID from success message!

## Troubleshooting

### "SponsorCap still not visible"
- Refresh Explorer page (F5)
- Make sure transaction is completed (check in Activity tab)
- Check if testnet is selected

### "Wallet approval not appearing"
- Make sure wallet extension is open
- Turn off popup blocker
- Refresh page and try again

### "Insufficient balance" error
- Get SUI from testnet faucet: https://faucet.sui.io/
- You should have at least 2-3 SUI test tokens

## Success Criteria

✅ Registration form filled on landing page
✅ Transaction approved in wallet
✅ SponsorCap visible on Explorer
✅ SponsorCap Object ID copied
✅ ID can be entered in Dashboard
✅ Competition creation successful

## Important Notes

- Every transaction requires gas fee (~0.002 SUI)
- SponsorCap ID is different from wallet address
- You will need to enter ID each time (security)
- Don't forget to save Competition ID (needed for next steps)
