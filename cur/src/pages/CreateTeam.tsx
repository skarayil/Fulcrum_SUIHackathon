import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "../config/constants";
import { useState } from "react";
import { PersonIcon } from "@radix-ui/react-icons";

export function CreateTeam() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [membersInput, setMembersInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeTx = (tx: Transaction, successMsg: string) => {
    setIsLoading(true);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("✅ Success Digest:", result.digest);
          alert(`${successMsg}\n\n🔗 Hash: ${result.digest}`);
          setIsLoading(false);
          setMembersInput(""); // Clear input after success
        },
        onError: (err) => {
          console.error("❌ Error Details:", err);
          alert("⚠️ Transaction failed. Please check the console.");
          setIsLoading(false);
        },
      }
    );
  };

  const createTeam = () => {
    if (!account) return;
    const membersArray = membersInput
      .split(/[\s,]+/)
      .map(m => m.trim())
      .filter(m => m.startsWith("0x"));

    if (membersArray.length === 0) {
      alert("⚠️ Please enter at least one valid member address (must start with 0x).");
      return;
    }

    const tx = new Transaction();
    
    // Create team - returns Team object
    const team = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_team`,
      arguments: [
        tx.pure.vector("address", membersArray)
      ],
    });

    // Transfer team to sender
    tx.transferObjects([team], account.address);

    executeTx(tx, "🚀 Team Successfully Created!\n\n💡 Don't forget to get the Team ID from the Explorer.");
  };

  if (!account) {
    return (
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 shadow-lg shadow-blue-500/10">
        <p className="text-blue-400 text-center">
          ⚠️ Please connect your wallet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-xl shadow-lg p-6 border border-blue-500/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
          <PersonIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Create Team</h2>
          <p className="text-sm text-gray-400">Create a team on blockchain and add members</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Member Addresses
        </label>
        <textarea
          placeholder="0xabc..., 0xdef..., 0x123..."
          value={membersInput}
          onChange={(e) => setMembersInput(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-black/50 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
        />
        <p className="text-xs text-gray-400 mt-2">
          💡 Separate addresses with commas or new lines. Each address must start with 0x.
        </p>
      </div>

      <button
        onClick={createTeam}
        disabled={isLoading || !membersInput.trim()}
        className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? "Processing..." : "🚀 Create Team on Blockchain"}
      </button>
    </div>
  );
}
