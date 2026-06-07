import { useState, useEffect, useRef } from "react";
import { 
  Search, Trophy, Users, AlertTriangle, ExternalLink, 
  CheckCircle, Info, Hash, Wallet, Globe, Award, Timer, Crown, Zap 
} from "lucide-react";

// --- MOCK HOOKS & COMPONENTS (Projenizde bunları kaldırıp gerçek importları kullanın) ---
// import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
const useCurrentAccount = () => ({ address: "0x1234567890abcdef1234567890abcdef12345678" });
const useSuiClient = () => ({
  getObject: async () => ({
    data: {
      content: {
        fields: {
          is_active: true,
          sponsor: "0xSponsorAddress...",
          rules: "1. Fair play\n2. Have fun",
          winning_team: "0xWinningTeamID...",
          teams: ["0xTeam1...", "0xTeam2..."],
          prize_pool: { fields: { balance: "10000000000" } }
        }
      }
    }
  })
});
const useSuiClientQuery = (method: string, params: any, options: any) => {
  // Simulating loading and data
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (options.enabled) {
      setIsLoading(true);
      setTimeout(() => {
        setData({
          data: {
            content: {
              fields: {
                is_active: true,
                sponsor: "0x789...Sponsor",
                rules: "Hackathon 2025 Kuralları:\n1. Takımlar en az 2 kişi olmalı.\n2. Proje açık kaynak olmalı.",
                winning_team: null,
                teams: ["0xTeamA...", "0xTeamB...", "0xTeamC..."],
                prize_pool: { fields: { balance: "5000000000" } }
              }
            }
          }
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [options.enabled]);

  return { data, isLoading, error: null };
};
// -------------------------------------------------------------------------------------

// --- STYLES & ANIMATIONS ---
const styles = {
  container: "min-h-screen bg-black text-slate-200 font-sans selection:bg-cyan-500/30",
  glassCard: "bg-neutral-900/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-300 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]",
  neonText: "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text font-extrabold",
  input: "bg-slate-900/60 border border-blue-500/30 text-white p-3 rounded-lg w-full focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-500",
  gradientButton: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2",
  badge: "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
  activeBadge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
  inactiveBadge: "bg-slate-700/30 text-slate-400 border border-slate-600/30",
};

export function ViewPool() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [competitionId, setCompetitionId] = useState("");
  const [searchId, setSearchId] = useState("");

  // Query competition data
  const { data: competitionData, isLoading, error } = useSuiClientQuery(
    "getObject",
    {
      id: searchId,
      options: {
        showContent: true,
        showOwner: true,
      },
    },
    {
      enabled: !!searchId && searchId.startsWith("0x"),
    }
  );

  const handleSearch = () => {
    if (competitionId.trim().startsWith("0x")) {
      setSearchId(competitionId.trim());
    }
  };

  // Parse competition data
  let competition: any = null;
  if (competitionData?.data?.content && "fields" in competitionData.data.content) {
    competition = competitionData.data.content.fields;
  }

  // State for team details
  const [teamDetails, setTeamDetails] = useState<Record<string, any>>({});
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [prizePoolBalance, setPrizePoolBalance] = useState<number | null>(null);
  const lastProcessedSearchId = useRef<string>("");

  // Helper function to recursively find balance in nested structure
  const findBalance = (obj: any, depth = 0): number => {
    if (depth > 5) return 0;
    if (typeof obj === "number") return obj;
    if (typeof obj === "string" && /^\d+$/.test(obj)) return Number(obj);
    if (obj && typeof obj === "object") {
      if ("balance" in obj) {
        const balance = obj.balance;
        if (typeof balance === "number") return balance;
        if (typeof balance === "string" && /^\d+$/.test(balance)) return Number(balance);
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = findBalance(obj[key], depth + 1);
          if (val > 0) return val;
        }
      }
    }
    return 0;
  };

  // Reset ref when searchId changes
  useEffect(() => {
    if (searchId && searchId !== lastProcessedSearchId.current) {
      lastProcessedSearchId.current = "";
      setPrizePoolBalance(null);
    }
  }, [searchId]);

  // Fetch prize pool balance
  useEffect(() => {
    if (!competition?.prize_pool || !searchId) {
      return;
    }

    if (lastProcessedSearchId.current === searchId) {
      return;
    }

    lastProcessedSearchId.current = searchId;

    const fetchPrizePool = async () => {
      const compFields = competition;
      let totalPrize = 0;
      
      // Simplified logic for simulation/preview
      if (compFields.prize_pool) {
         totalPrize = findBalance(compFields.prize_pool);
      }
      
      setPrizePoolBalance(totalPrize);
    };

    setPrizePoolBalance(null);
    fetchPrizePool();
  }, [searchId, competition]);

  // Fetch team details when competition teams are available
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!competition?.teams || competition.teams.length === 0) {
        setTeamDetails({});
        return;
      }

      setLoadingTeams(true);
      // Simulating team fetch
      setTimeout(() => {
          const mockDetails: any = {};
          competition.teams.forEach((tId: string, i: number) => {
              mockDetails[tId] = {
                  members: [`0xUser${i}A...`, `0xUser${i}B...`],
                  leader: `0xUser${i}A...`
              };
          });
          setTeamDetails(mockDetails);
          setLoadingTeams(false);
      }, 800);
    };

    if (competition && competition.teams) {
      fetchTeamDetails();
    }
  }, [competition]);

  if (!account) {
    return (
      <div className={`${styles.container} flex items-center justify-center`}>
        <div className={`${styles.glassCard} max-w-md w-full text-center py-12`}>
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle size={48} className="text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">View Competition</h1>
            <p className="text-red-400">Please connect your wallet to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container mx-auto px-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-center gap-3 mb-4">
             <Globe size={32} className="text-cyan-400" />
             <h1 className={`text-4xl ${styles.neonText}`}>View Competition</h1>
          </div>

          {/* Search Section */}
          <div className={styles.glassCard}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                 <Search size={20} className="text-cyan-400" />
                 <h2 className="text-xl font-bold text-white">Search Competition</h2>
              </div>
              <p className="text-slate-400 text-sm">Enter a valid Competition ID to fetch details directly from the blockchain.</p>
              
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Competition ID</label>
                  <div className="relative">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={competitionId}
                        onChange={(e) => setCompetitionId(e.target.value)}
                        className={styles.input}
                      />
                      <Hash size={16} className="absolute right-3 top-3.5 text-slate-500" />
                  </div>
                </div>
                <button 
                    onClick={handleSearch} 
                    disabled={!competitionId.trim()}
                    className={styles.gradientButton}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className={styles.glassCard}>
              <div className="flex items-center justify-center gap-3 py-8">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-cyan-400 font-medium">Scanning Blockchain...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={20} className="text-red-500" />
                  <span className="font-bold text-red-500">Not Found</span>
              </div>
              <p className="text-slate-400 text-sm">Could not load competition. Please check the ID and try again.</p>
            </div>
          )}

          {/* Competition Data */}
          {competition && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
              {/* Status Badge */}
              <div className={`${styles.glassCard} py-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Trophy size={20} className="text-yellow-400" />
                      <h2 className="text-lg font-bold text-white">Competition Status</h2>
                  </div>
                  <div className={competition.is_active ? styles.activeBadge : styles.inactiveBadge}>
                    {competition.is_active ? <Timer size={14} /> : <CheckCircle size={14} />}
                    {competition.is_active ? "Active" : "Ended"}
                  </div>
                </div>
              </div>

              {/* Basic Info & Prize Pool Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Info */}
                  <div className={styles.glassCard}>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2">
                             <Info size={20} className="text-blue-400" />
                             <h2 className="text-lg font-bold text-white">Details</h2>
                        </div>
                        
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Competition ID</span>
                            <p className="font-mono text-slate-300 text-sm break-all mt-1">{searchId}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sponsor</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Wallet size={14} className="text-slate-500" />
                                <p className="font-mono text-slate-300 text-sm break-all">{competition.sponsor}</p>
                            </div>
                        </div>
                        <div>
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rules</span>
                             <div className="bg-black/30 p-3 rounded-lg mt-2 border border-white/5">
                                 <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{competition.rules}</p>
                             </div>
                        </div>
                    </div>
                  </div>

                  {/* Prize Pool */}
                  <div className={`${styles.glassCard} border-cyan-500/30 relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
                    <div className="flex flex-col gap-4 items-center justify-center h-full relative z-10 py-8">
                        <Zap size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse" />
                        <h2 className="text-xl font-bold text-white">Prize Pool</h2>
                        
                        {prizePoolBalance !== null ? (
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                                    {(prizePoolBalance / 1_000_000_000).toFixed(2)} SUI
                                </span>
                                <span className="text-sm text-slate-500 mt-2 font-mono">
                                    {(prizePoolBalance).toLocaleString()} MIST
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>Fetching balance...</span>
                            </div>
                        )}
                    </div>
                  </div>
              </div>

              {/* Teams Section */}
              <div className={styles.glassCard}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Users size={20} className="text-cyan-400" />
                          <h2 className="text-lg font-bold text-white">Registered Teams</h2>
                      </div>
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{competition.teams?.length || 0} Teams</span>
                  </div>

                  {competition.teams && competition.teams.length > 0 && (
                     <div className="max-h-[150px] overflow-y-auto p-2 bg-black/20 rounded-lg border border-white/5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <div className="flex flex-col gap-1">
                            {competition.teams.map((teamId: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors">
                                    <span className="text-xs text-slate-500 font-mono w-6">#{idx+1}</span>
                                    <span className="text-sm font-mono text-slate-300">{teamId}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                  )}
                </div>
              </div>

              {/* Team Members Detail */}
              {competition.teams && competition.teams.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mt-4">
                        <h2 className="text-xl font-bold text-white">Team Rosters</h2>
                    </div>
                    
                    {loadingTeams ? (
                      <div className={styles.glassCard}>
                          <div className="flex items-center justify-center gap-3 py-8">
                              <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-slate-400">Loading team details...</span>
                          </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {competition.teams.map((teamId: string, idx: number) => {
                          const team = teamDetails[teamId];
                          if (!team) return null;

                          const members = team.members || [];
                          const leader = team.leader || "";

                          return (
                            <div key={teamId} className={`${styles.glassCard} border-l-4 border-l-blue-500 hover:scale-[1.01] transition-transform`}>
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded">Team {idx + 1}</span>
                                        <span className="text-xs text-slate-500">{members.length} Members</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">ID</span>
                                    <p className="text-[10px] font-mono text-slate-500 break-all">{teamId}</p>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-2 flex flex-col gap-1">
                                    {members.map((member: string, mIdx: number) => (
                                        <div key={mIdx} className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded cursor-pointer group" onClick={() => navigator.clipboard.writeText(member)}>
                                            <div className="w-4 flex justify-center">
                                                {member === leader ? <Crown size={12} className="text-yellow-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>}
                                            </div>
                                            <span className={`text-xs font-mono transition-colors ${member === leader ? "text-yellow-400" : "text-slate-300 group-hover:text-white"}`}>
                                                {member.slice(0, 12)}...{member.slice(-8)}
                                            </span>
                                            {member === leader && <span className="ml-auto text-[9px] bg-yellow-500/20 text-yellow-300 px-1.5 rounded">Leader</span>}
                                        </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
              )}

              {/* Winning Team Special Card */}
              {competition.winning_team && (
                <div className={`${styles.glassCard} mt-4 border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]`}>
                  <div className="flex flex-col gap-4 items-center text-center py-4">
                    <Award size={48} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">🏆 Winner Declared</h2>
                    
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Winning Team ID</span>
                      <p className="text-xl font-bold font-mono text-emerald-400 break-all mt-1 shadow-emerald-500/20 drop-shadow-sm">
                        {competition.winning_team}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Explorer Link */}
              <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => window.open(`https://suiscan.xyz/testnet/object/${searchId}`, "_blank")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                      <ExternalLink size={16} />
                      View Object on Sui Explorer
                  </button>
              </div>

            </div>
          )}

          {/* No Data State */}
          {!competition && !isLoading && !error && searchId && (
            <div className={styles.glassCard}>
               <div className="flex flex-col items-center gap-4 py-8">
                  <Search size={48} className="text-slate-700" />
                  <p className="text-slate-400 font-medium">No competition found with this ID.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}