import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
// Radix UI importlarını kaldırdık, yerine Tailwind sınıfları ve Lucide ikonları kullanacağız
import { 
  User, Users, Trophy, Search, Crown, AlertTriangle, 
  Loader2, Info, RefreshCw, Hash, Shield 
} from "lucide-react";

// --- GLOBAL STYLES & ANIMATIONS ---
const styles = {
  container: "min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30",
  glassCard: "bg-neutral-900/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-300 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]",
  neonText: "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text font-extrabold",
  input: "bg-slate-900/60 border border-blue-500/30 text-white p-3 rounded-lg w-full focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500",
  gradientButton: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2",
  badge: "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
  activeBadge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
  inactiveBadge: "bg-slate-700/30 text-slate-400 border border-slate-600/30",
  leaderBadge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
};

// Animasyonlar
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    .hover-scale:hover { transform: scale(1.01); transition: transform 0.2s; }
  `}</style>
);

export function ContestantDashboard() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  
  // Team info state - persist in localStorage
  const [teamId, setTeamId] = useState("");
  // Competition ID (used to derive the team automatically)
  const [competitionId, setCompetitionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastCompetitionId') || '';
    }
    return '';
  });
  const [competitionIdInput, setCompetitionIdInput] = useState("");
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load saved team data when account changes
  useEffect(() => {
    if (account?.address && typeof window !== 'undefined') {
      const savedTeamId = localStorage.getItem(`teamId_${account.address}`) || '';
      const savedMembers = localStorage.getItem(`teamMembers_${account.address}`);
      const savedIsLeader = localStorage.getItem(`isTeamLeader_${account.address}`);
      
      if (savedTeamId) {
        setTeamId(savedTeamId);
        setTeamMembers(savedMembers ? JSON.parse(savedMembers) : []);
        setIsTeamLeader(savedIsLeader === 'true');
        console.log("📦 Restored team data from localStorage:", { savedTeamId, isLeader: savedIsLeader === 'true' });
      } else {
        // Clear if switching to an account without saved data
        setTeamId("");
        setTeamMembers([]);
        setIsTeamLeader(false);
      }
    }
  }, [account?.address]);

  // Derive team automatically from competition's team list
  const loadTeamInfo = async () => {
    if (!account?.address) {
      setMessage("Please connect your wallet");
      return;
    }
    const compId = (competitionIdInput.trim() || competitionId).trim();
    if (!compId) {
      setMessage("Enter Competition ID (sponsor gives after creation).");
      return;
    }
    setIsLoading(true);
    setMessage("Loading teams...");
    try {
      const compObj = await suiClient.getObject({
        id: compId,
        options: { showContent: true },
      });
      if (!compObj.data || !compObj.data.content) {
        setMessage("Competition not found. Check ID.");
        return;
      }
      const compFields = (compObj.data.content as any)?.fields;
      const teamIds: string[] = compFields?.teams || [];
      if (!teamIds || teamIds.length === 0) {
        setMessage("No teams found in this competition yet.");
        return;
      }
      // Fetch all teams
      const teams = await suiClient.multiGetObjects({
        ids: teamIds,
        options: { showContent: true },
      });
      let found: { id: string; members: string[]; leader: string } | null = null;
      for (const t of teams) {
        const tf = (t.data?.content as any)?.fields;
        const members: string[] = tf?.members || [];
        if (members.some(m => typeof m === 'string' && m.toLowerCase() === account.address.toLowerCase())) {
          found = { id: t.data!.objectId, members, leader: tf.leader || members[0] || account.address };
          break;
        }
      }
      if (!found) {
        setMessage("You are not in any team for this competition.");
        return;
      }
      setTeamId(found.id);
      setTeamMembers(found.members);
      const isLeader = found.leader.toLowerCase() === account.address.toLowerCase();
      setIsTeamLeader(isLeader);
      setMessage("Team loaded successfully.");
      // Persist
      localStorage.setItem('lastCompetitionId', compId);
      localStorage.setItem(`teamId_${account.address}`, found.id);
      localStorage.setItem(`teamMembers_${account.address}`, JSON.stringify(found.members));
      localStorage.setItem(`isTeamLeader_${account.address}`, String(isLeader));
      console.log("✅ Derived team", found);
    } catch (err: any) {
      console.error("Load team error:", err);
      setMessage(`Error: ${err.message || 'Failed to load team'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamInfo();
  }, [account?.address]);

  if (!account) {
    return (
      <div className={`${styles.container} flex items-center justify-center`}>
        <div className={`${styles.glassCard} max-w-md w-full text-center py-12`}>
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle size={48} className="text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">Contestant Dashboard</h1>
            <p className="text-red-400">Please connect your wallet to access dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AnimationStyles />
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User size={32} className="text-cyan-400" />
            <h1 className={`text-4xl ${styles.neonText}`}>Contestant Dashboard</h1>
          </div>
        
          {/* Team Info Card */}
          <div className={styles.glassCard}>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Users size={24} className="text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Team Information</h2>
              </div>

              {/* Competition ID Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Trophy size={16} /> Competition ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={competitionIdInput || competitionId}
                    onChange={(e) => setCompetitionIdInput(e.target.value)}
                    className={styles.input}
                  />
                  <Search size={16} className="absolute right-3 top-3.5 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Info size={12} /> Auto-filled if competition was created on this device
                </p>
              </div>
              
              {/* Team ID & Role Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Team ID</span>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-slate-400" />
                    <span className="font-mono text-slate-300 text-sm break-all">
                      {teamId || "Not loaded yet"}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Role</span>
                  <div className="flex items-start">
                    {isTeamLeader ? (
                      <span className={styles.leaderBadge}>
                        <Crown size={14} /> Team Leader
                      </span>
                    ) : (
                      <span className={styles.inactiveBadge}>
                        <Shield size={14} /> Team Member
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              {teamMembers.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Team Roster ({teamMembers.length})
                  </span>
                  <div className="bg-black/30 rounded-lg p-2 border border-white/5 max-h-[200px] overflow-y-auto">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded transition-colors group">
                        <div className="w-8 flex justify-center">
                           {/* Highlight current user */}
                           {member.toLowerCase() === account.address.toLowerCase() ? (
                             <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                           ) : (
                             <span className="text-xs text-slate-600 font-mono">#{idx + 1}</span>
                           )}
                        </div>
                        
                        <span className={`font-mono text-sm transition-colors ${member.toLowerCase() === account.address.toLowerCase() ? "text-cyan-400 font-bold" : "text-slate-300 group-hover:text-white"}`}>
                          {member}
                        </span>
                        
                        {/* Identify current user tag */}
                        {member.toLowerCase() === account.address.toLowerCase() && (
                          <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">YOU</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <button 
                  onClick={loadTeamInfo} 
                  disabled={isLoading}
                  className={styles.gradientButton}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                  {isLoading ? 'Fetching Data...' : 'Load / Refresh Team Info'}
                </button>

                {message && (
                  <div className={`p-3 rounded-lg text-sm border flex items-center gap-2 ${message.toLowerCase().includes('success') ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-slate-800/50 border-slate-700 text-slate-300'}`}>
                    {message.toLowerCase().includes('error') && <AlertTriangle size={16} className="text-red-400" />}
                    {message}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}