import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { useState, useEffect, useRef } from "react";
import { Card, Button, TextField, Flex, Text, Heading, Badge, Spinner } from "@radix-ui/themes";
import { 
  Search, Trophy, Users, AlertTriangle, Info, 
  Copy, Zap, Eye, Shield, Award, FileText
} from "lucide-react";

// --- GLOBAL STYLES & ANIMATIONS ---
const styles = {
  container: {
    background: "#000000",
    minHeight: "100vh",
    color: "#e2e8f0",
  },
  glassCard: {
    backgroundColor: "rgba(10, 10, 10, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(34, 211, 238, 0.2)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.8)",
    transition: "all 0.3s ease",
  },
  neonText: {
    background: "linear-gradient(to right, #60A5FA, #22D3EE, #3B82F6)", 
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
  },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    color: "#fff",
    padding: "4px",
  },
  fulcrumButton: {
    background: "linear-gradient(90deg, #60A5FA 0%, #22D3EE 50%, #3B82F6 100%)",
    color: "white", 
    fontWeight: "bold",
    border: "none",
    boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)",
  }
};

// CSS Injection for animations
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes glow { 0% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.2); } 50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.5); } 100% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.2); } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    .animate-glow { animation: glow 3s infinite; }
    .hover-scale:hover { transform: scale(1.02); transition: transform 0.3s; }
  `}</style>
);

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
    if (depth > 5) return 0; // Prevent infinite recursion
    if (typeof obj === "number") return obj;
    if (typeof obj === "string" && /^\d+$/.test(obj)) return Number(obj);
    if (obj && typeof obj === "object") {
      if ("balance" in obj) {
        const balance = obj.balance;
        if (typeof balance === "number") return balance;
        if (typeof balance === "string" && /^\d+$/.test(balance)) return Number(balance);
      }
      // Recursively search in all keys
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
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

  // Fetch prize pool balance - using the same logic as NewSponsorDashboard
  useEffect(() => {
    if (!competition?.prize_pool || !searchId) {
      return;
    }

    // Only process if we haven't processed this searchId yet
    if (lastProcessedSearchId.current === searchId) {
      return;
    }

    // Mark this searchId as processed
    lastProcessedSearchId.current = searchId;

    const fetchPrizePool = async () => {
      const compFields = competition;
      console.log("📋 Competition fields:", compFields);
      console.log("💰 Prize pool (full):", JSON.stringify(compFields.prize_pool, null, 2));
      
      // Try different ways to get prize amount (same as NewSponsorDashboard)
      let totalPrize = 0;
      if (compFields.prize_pool) {
        console.log("🔍 Prize pool type:", typeof compFields.prize_pool);
        console.log("🔍 Prize pool keys:", Object.keys(compFields.prize_pool || {}));
        
        // Method 1: prize_pool.fields.balance (most common)
        if (compFields.prize_pool.fields) {
          console.log("🔍 Prize pool.fields exists:", compFields.prize_pool.fields);
          console.log("🔍 Prize pool.fields.balance:", compFields.prize_pool.fields.balance);
          
          if (compFields.prize_pool.fields.balance !== undefined && compFields.prize_pool.fields.balance !== null) {
            totalPrize = Number(compFields.prize_pool.fields.balance);
            console.log("✅ Found balance via fields.balance:", totalPrize, "(raw:", compFields.prize_pool.fields.balance, ")");
          }
        }
        // Method 2: prize_pool.balance (direct)
        else if (compFields.prize_pool.balance !== undefined && compFields.prize_pool.balance !== null) {
          totalPrize = Number(compFields.prize_pool.balance);
          console.log("✅ Found balance via direct balance:", totalPrize);
        }
        // Method 3: prize_pool might be an object ID, need to fetch it
        else if (typeof compFields.prize_pool === "string" && compFields.prize_pool.startsWith("0x")) {
          console.log("🔍 Prize pool is an object ID, fetching...");
          try {
            const prizePoolObj = await suiClient.getObject({
              id: compFields.prize_pool,
              options: {
                showContent: true,
              }
            });
            console.log("💰 Prize pool object:", JSON.stringify(prizePoolObj, null, 2));
            if (prizePoolObj.data?.content && "fields" in prizePoolObj.data.content) {
              const poolFields = prizePoolObj.data.content.fields as any;
              if (poolFields.balance !== undefined) {
                totalPrize = Number(poolFields.balance);
                console.log("✅ Found balance from prize pool object:", totalPrize);
              }
            }
          } catch (err) {
            console.error("Error fetching prize pool object:", err);
          }
        }
        // Method 4: Check if it's a nested structure
        else if (typeof compFields.prize_pool === "object") {
          console.log("🔍 Prize pool is object, checking all keys:", Object.keys(compFields.prize_pool));
          // Try to find balance in nested structure
          const findBalanceRecursive = (obj: any, depth = 0): number => {
            if (depth > 3) return 0;
            if (typeof obj === "number") return obj;
            if (typeof obj === "string" && /^\d+$/.test(obj)) return Number(obj);
            if (obj && typeof obj === "object") {
              if ("balance" in obj) return Number(obj.balance) || 0;
              for (const key in obj) {
                const val = findBalanceRecursive(obj[key], depth + 1);
                if (val > 0) return val;
              }
            }
            return 0;
          };
          totalPrize = findBalanceRecursive(compFields.prize_pool);
          if (totalPrize > 0) {
            console.log("✅ Found balance via recursive search:", totalPrize);
          }
        }
      }
      
      console.log("💰 Total prize (MIST):", totalPrize);
      
      // Update state with the found balance
      setPrizePoolBalance(totalPrize);
      console.log("✅ State updated with balance:", totalPrize);
    };

    // Reset to null first to show loading state
    setPrizePoolBalance(null);
    fetchPrizePool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId, competition]); // Depend on searchId and competition

  // Fetch team details when competition teams are available
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!competition?.teams || competition.teams.length === 0) {
        setTeamDetails({});
        return;
      }

      setLoadingTeams(true);
      const teamData: Record<string, any> = {};

      try {
        await Promise.all(
          competition.teams.map(async (teamId: string) => {
            try {
              const teamObj = await suiClient.getObject({
                id: teamId,
                options: {
                  showContent: true,
                },
              });

              if (teamObj.data?.content && "fields" in teamObj.data.content) {
                teamData[teamId] = teamObj.data.content.fields;
              }
            } catch (err) {
              console.error(`Error fetching team ${teamId}:`, err);
            }
          })
        );
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setTeamDetails(teamData);
        setLoadingTeams(false);
      }
    };

    if (competition && competition.teams) {
      fetchTeamDetails();
    }
  }, [competition, suiClient]);

  if (!account) {
    return (
      <div style={styles.container} className="flex items-center justify-center">
        <AnimationStyles />
        <Card style={styles.glassCard} size="4">
          <Flex direction="column" gap="4" align="center" style={{ padding: "40px" }}>
            <AlertTriangle size={48} color="#ef4444" className="animate-pulse" />
            <Heading size="6" style={{ color: "#fff" }}>View Competition</Heading>
            <Text color="red" size="3">Please connect your wallet to proceed</Text>
          </Flex>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AnimationStyles />
      <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Flex direction="column" gap="6">
        <Flex align="center" justify="center" gap="3" className="mb-4">
          <Eye size={32} color="#22D3EE" />
          <Heading size="8" style={styles.neonText}>View Competition</Heading>
        </Flex>

        {/* Search Section */}
        <Card style={styles.glassCard}>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="2">
              <Search size={24} color="#60a5fa" />
              <Heading size="5" style={{ color: "#fff" }}>Search Competition</Heading>
            </Flex>
            <Text size="2" color="gray">Enter a Competition ID to view its details</Text>
            
            <Flex gap="2" align="end">
              <div style={{ flex: 1 }}>
                <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Competition ID</Text>
                <TextField.Root
                  placeholder="0x..."
                  value={competitionId}
                  onChange={(e) => setCompetitionId(e.target.value)}
                  size="3"
                  style={styles.input}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                size="3" 
                disabled={!competitionId.trim()}
                className="hover-scale"
                style={styles.fulcrumButton}
              >
                <Search size={18} /> Search
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card style={styles.glassCard}>
            <Flex align="center" gap="3" justify="center">
              <Spinner />
              <Text style={{ color: "#fff" }}>Loading competition data...</Text>
            </Flex>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.4)", borderLeft: "4px solid #ef4444", backdropFilter: "blur(12px)", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.8)" }}>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <AlertTriangle size={24} color="#ef4444" />
                <Text size="3" weight="bold" style={{ color: "#ef4444" }}>Error</Text>
              </Flex>
              <Text size="2" color="gray">Could not load competition. Make sure the ID is correct.</Text>
            </Flex>
          </Card>
        )}

        {/* Competition Data */}
        {competition && (
          <Flex direction="column" gap="4">
            {/* Status Badge */}
            <Card style={styles.glassCard}>
              <Flex align="center" justify="between">
                <Flex align="center" gap="2">
                  <Shield size={24} color="#22D3EE" />
                  <Heading size="5" style={{ color: "#fff" }}>Competition Status</Heading>
                </Flex>
                <Badge color={competition.is_active ? "green" : "gray"} size="3">
                  {competition.is_active ? "🟢 Active" : "⚫ Ended"}
                </Badge>
              </Flex>
            </Card>

            {/* Basic Info */}
            <Card style={styles.glassCard}>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <FileText size={24} color="#60a5fa" />
                  <Heading size="4" style={{ color: "#fff" }}>Basic Information</Heading>
                </Flex>
                
                <div>
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Competition ID</Text>
                  <Flex align="center" gap="2" style={{ marginTop: 4 }}>
                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#94a3b8" }}>
                      {searchId}
                    </Text>
                    <Copy 
                      size={16} 
                      color="#22D3EE" 
                      style={{ cursor: "pointer", flexShrink: 0 }} 
                      onClick={() => {
                        navigator.clipboard.writeText(searchId);
                      }} 
                    />
                  </Flex>
                </div>

                <div>
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Sponsor Address</Text>
                  <Flex align="center" gap="2" style={{ marginTop: 4 }}>
                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#94a3b8" }}>
                      {competition.sponsor}
                    </Text>
                    <Copy 
                      size={16} 
                      color="#22D3EE" 
                      style={{ cursor: "pointer", flexShrink: 0 }} 
                      onClick={() => {
                        navigator.clipboard.writeText(competition.sponsor);
                      }} 
                    />
                  </Flex>
                </div>

                <div>
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Rules</Text>
                  <Card variant="surface" style={{ backgroundColor: "rgba(34, 211, 238, 0.05)", marginTop: 8, padding: 12 }}>
                    <Text size="2" style={{ whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
                      {competition.rules}
                    </Text>
                  </Card>
                </div>
              </Flex>
            </Card>

            {/* Prize Pool */}
            <Card style={styles.glassCard}>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <Zap size={24} color="#eab308" />
                  <Heading size="4" style={{ color: "#fff" }}>Prize Pool</Heading>
                </Flex>
                
                <div>
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Total Prize Amount</Text>
                  {prizePoolBalance !== null ? (
                    <>
                      <Text size="6" weight="bold" style={{ color: "#22D3EE", display: "block", marginTop: 8 }}>
                        {(prizePoolBalance / 1_000_000_000).toFixed(4)} SUI
                      </Text>
                      <Text size="1" color="gray">
                        ({prizePoolBalance.toLocaleString()} MIST)
                      </Text>
                    </>
                  ) : (
                    <Flex align="center" gap="2" style={{ marginTop: 8 }}>
                      <Spinner size="2" />
                      <Text size="2" color="gray">Loading prize pool...</Text>
                    </Flex>
                  )}
                </div>
              </Flex>
            </Card>

            {/* Teams */}
            <Card style={styles.glassCard}>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <Users size={24} color="#60a5fa" />
                  <Heading size="4" style={{ color: "#fff" }}>Teams</Heading>
                </Flex>
                
                <div>
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Number of Teams</Text>
                  <Text size="4" weight="bold" style={{ color: "#fff", marginTop: 4 }}>
                    {competition.teams?.length || 0} teams
                  </Text>
                </div>

                {competition.teams && competition.teams.length > 0 && (
                  <Card variant="surface" style={{ backgroundColor: "rgba(34, 211, 238, 0.05)", padding: 12 }}>
                    <Flex direction="column" gap="2">
                      <Text size="2" weight="bold" style={{ color: "#22D3EE" }}>Team IDs:</Text>
                      {competition.teams.map((teamId: string, idx: number) => (
                        <Flex key={idx} align="center" gap="2" justify="between">
                          <Flex align="center" gap="2" style={{ flex: 1, minWidth: 0 }}>
                            <Badge color="cyan" size="1">{idx + 1}</Badge>
                            <Text size="1" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#94a3b8" }}>
                              {teamId}
                            </Text>
                          </Flex>
                          <Copy 
                            size={14} 
                            color="#22D3EE" 
                            style={{ cursor: "pointer", flexShrink: 0 }} 
                            onClick={() => navigator.clipboard.writeText(teamId)} 
                          />
                        </Flex>
                      ))}
                    </Flex>
                  </Card>
                )}
              </Flex>
            </Card>

            {/* Team Members */}
            {competition.teams && competition.teams.length > 0 && (
              <Card style={styles.glassCard}>
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Users size={24} color="#22D3EE" />
                    <Heading size="4" style={{ color: "#fff" }}>Team Members</Heading>
                  </Flex>
                  
                  {loadingTeams ? (
                    <Flex align="center" gap="2">
                      <Spinner />
                      <Text size="2" style={{ color: "#fff" }}>Loading team members...</Text>
                    </Flex>
                  ) : (
                    <Flex direction="column" gap="4">
                      {competition.teams.map((teamId: string, idx: number) => {
                        const team = teamDetails[teamId];
                        if (!team) {
                          return (
                            <Card key={teamId} variant="surface" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                              <Flex direction="column" gap="2">
                                <Flex align="center" gap="2">
                                  <Badge color="amber">Team {idx + 1}</Badge>
                                  <Text size="2" weight="bold" style={{ color: "#fff" }}>Loading...</Text>
                                </Flex>
                                <Text size="1" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#94a3b8" }}>
                                  {teamId}
                                </Text>
                              </Flex>
                            </Card>
                          );
                        }

                        const members = team.members || [];
                        const leader = team.leader || "";

                        return (
                          <Card key={teamId} variant="surface" style={{ backgroundColor: "rgba(34, 211, 238, 0.05)", border: "1px solid rgba(34, 211, 238, 0.2)", padding: 16 }}>
                            <Flex direction="column" gap="3">
                              <Flex align="center" gap="2">
                                <Badge color="cyan" size="2">Team {idx + 1}</Badge>
                                <Text size="2" weight="bold" style={{ color: "#fff" }}>{members.length} member(s)</Text>
                              </Flex>
                              
                              <div>
                                <Text size="1" weight="bold" style={{ color: "#60a5fa" }}>Team ID:</Text>
                                <Flex align="center" gap="2" style={{ marginTop: 4 }}>
                                  <Text size="1" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#94a3b8" }}>
                                    {teamId}
                                  </Text>
                                  <Copy 
                                    size={12} 
                                    color="#22D3EE" 
                                    style={{ cursor: "pointer", flexShrink: 0 }} 
                                    onClick={() => navigator.clipboard.writeText(teamId)} 
                                  />
                                </Flex>
                              </div>

                              {leader && (
                                <div>
                                  <Flex align="center" gap="2">
                                    <Award size={16} color="#eab308" />
                                    <Text size="1" weight="bold" style={{ color: "#60a5fa" }}>Team Leader:</Text>
                                  </Flex>
                                  <Flex align="center" gap="2" style={{ marginTop: 4 }}>
                                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#eab308" }}>
                                      {leader}
                                    </Text>
                                    <Copy 
                                      size={12} 
                                      color="#eab308" 
                                      style={{ cursor: "pointer", flexShrink: 0 }} 
                                      onClick={() => navigator.clipboard.writeText(leader)} 
                                    />
                                  </Flex>
                                </div>
                              )}

                              {members.length > 0 && (
                                <div>
                                  <Text size="1" weight="bold" style={{ color: "#60a5fa" }}>Members:</Text>
                                  <Card variant="surface" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", marginTop: "8px", padding: 12 }}>
                                    <Flex direction="column" gap="2">
                                      {members.map((member: string, memberIdx: number) => (
                                        <Flex key={memberIdx} align="center" gap="2" justify="between">
                                          <Flex align="center" gap="2" style={{ flex: 1, minWidth: 0 }}>
                                            <Badge color={member === leader ? "amber" : "gray"} size="1">
                                              {memberIdx + 1}
                                            </Badge>
                                            <Text 
                                              size="1" 
                                              style={{ 
                                                fontFamily: "monospace", 
                                                wordBreak: "break-all",
                                                color: member === leader ? "#eab308" : "#94a3b8"
                                              }}
                                            >
                                              {member}
                                            </Text>
                                            {member === leader && (
                                              <Badge color="amber" variant="soft" size="1">Leader</Badge>
                                            )}
                                          </Flex>
                                          <Copy 
                                            size={12} 
                                            color="#22D3EE" 
                                            style={{ cursor: "pointer", flexShrink: 0 }} 
                                            onClick={() => navigator.clipboard.writeText(member)} 
                                          />
                                        </Flex>
                                      ))}
                                    </Flex>
                                  </Card>
                                </div>
                              )}
                            </Flex>
                          </Card>
                        );
                      })}
                    </Flex>
                  )}
                </Flex>
              </Card>
            )}

            {/* Winning Team */}
            {competition.winning_team && (
              <Card style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", backdropFilter: "blur(12px)" }} className="animate-glow">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Trophy size={28} color="#4ade80" />
                    <Heading size="4" style={{ color: "#4ade80" }}>Winner</Heading>
                  </Flex>
                  
                  <div>
                    <Text size="2" weight="bold" style={{ color: "#22D3EE" }}>Winning Team ID</Text>
                    <Flex align="center" gap="2" style={{ marginTop: 4 }}>
                      <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all", color: "#4ade80" }}>
                        {competition.winning_team}
                      </Text>
                      <Copy 
                        size={16} 
                        color="#4ade80" 
                        style={{ cursor: "pointer", flexShrink: 0 }} 
                        onClick={() => navigator.clipboard.writeText(competition.winning_team)} 
                      />
                    </Flex>
                  </div>
                </Flex>
              </Card>
            )}

            {/* Explorer Link */}
            <Card variant="surface" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)" }}>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Info size={16} color="#60a5fa" />
                  <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>View on Explorer</Text>
                </Flex>
                <a
                  href={`https://suiscan.xyz/testnet/object/${searchId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#22D3EE", textDecoration: "underline", fontSize: "14px" }}
                >
                  Open in Sui Explorer →
                </a>
              </Flex>
            </Card>
          </Flex>
        )}

        {/* No Data State */}
        {!competition && !isLoading && !error && searchId && (
          <Card style={styles.glassCard}>
            <Text size="2" color="gray" align="center">
              No competition found with this ID
            </Text>
          </Card>
        )}
      </Flex>
      </div>
    </div>
  );
}