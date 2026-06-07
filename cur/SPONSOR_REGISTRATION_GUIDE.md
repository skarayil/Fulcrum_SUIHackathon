# Sponsor Registration and Test Guide

## Step 1: Register as a Sponsor

### Wallet Information
- **Email:** f4kpss1907@gmail.com
- **Wallet:** 0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623

### Registration Process

1. **Go to the Home Page**
   - In the browser: http://localhost:5173
   - You will be redirected to the home page

2. **Find the "Join the Community" Form**
   - Scroll down the page
   - See the form titled "Join the Community"

3. **Fill out the Form**
   - **Name:** Any name (e.g., "F4 Sponsor")
   - **Email:** f4kpss1907@gmail.com
   - **Role:** Select **"Sponsor"** from the dropdown
   - **Message:** Optional (e.g., "Test sponsor registration")

4. **Submit and Approve**
   - Click the "Register" button
   - A wallet popup will open
   - Approve the transaction
   - Wait for the transaction to complete

5. **Get Your SponsorCap ID**
   - After the transaction is successful:
   - Go to the Explorer: https://suiexplorer.com/?network=testnet
   - Search for your wallet address: 0x60be68f004e0dde8b2cadaaae37c0a2aadefd7c0eb66f91875e4eb0865e6b623
   - You will now see **2 items** in the "Assets" section
   - Find the **SponsorCap** object
   - Copy the Object ID (e.g., 0xca53...f0763)

## Step 2: Test the Sponsor Dashboard

1. **Go to the Dashboard**
   - URL: http://localhost:5173/new-sponsor-dashboard
   - Or click the "Sponsor" button in the top menu

2. **Enter the SponsorCap ID**
   - There is a "Your SponsorCap Object ID" field in the first card
   - Paste the Object ID you copied

3. **Create a Competition**
   - In the "Create Competition" tab:
   - Rules: "Blockchain hackathon test"
   - Prize Amount: 1000000000 (1 SUI)
   - Jury Addresses:
     ```
     0xc4151953e58edb05fbc77fabcaf428cc611a8ffec62fceeeb715bc46fd68f416
     0xddc32010138da3ac8e3cf73c94548ad592dfba787071d6cd9db78a97fac2cde9
     ```
   - Click the "Create Competition" button
   - Approve in the wallet
   - Note the Competition ID in the success message!

## Troubleshooting

### "SponsorCap still not visible"
- Refresh the Explorer page (F5)
- Make sure the transaction is complete (check in the Activity tab)
- Check if the Testnet is selected

### "Approval not appearing in the wallet"
- Make sure the wallet extension is open
- Disable the popup blocker
- Refresh the page and try again

### "Insufficient balance" error
- Get SUI from the Testnet faucet: https://faucet.sui.io/
- You should have at least 2-3 SUI test tokens

## Success Criteria

✅ Registration form filled out on the landing page
✅ Transaction approved in the wallet
✅ SponsorCap visible in the Explorer
✅ SponsorCap Object ID copied
✅ ID could be entered on the dashboard
✅ Competition creation successful

## Important Notes

- Every transaction requires a gas fee (~0.002 SUI)
- The SponsorCap ID is different from the wallet address
- You will need to enter the ID every time you use it (for security)
- Don't forget to save the Competition ID (required for the next steps)
