import { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { Card, Button, TextField, Flex, Text, Heading, TextArea, Badge, Tabs, Spinner, Box, Separator } from "@radix-ui/themes";
import { PACKAGE_ID, REWARD_REGISTRY_ID } from "../config/constants";
import { useContestantRegistrations } from "../hooks/useContestantRegistrations";
// New modern icons
import { 
  Rocket, Trophy, Users, Gift, AlertTriangle, CheckCircle, Info, 
  Copy, Trash2, Plus, RefreshCw, Wand2, Search, Zap, ShieldCheck 
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
    border: "1px solid rgba(34, 211, 238, 0.2)", // Cyan border hint
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.8)",
    transition: "all 0.3s ease",
  },
  // App.tsx'teki "from-blue-400 via-cyan-400 to-blue-500" gradienti
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
  // Same gradient for buttons
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
    .tab-trigger { color: #94a3b8 !important; transition: all 0.3s !important; font-weight: 600; }
    .tab-trigger[data-state='active'] { 
        color: #22D3EE !important; 
        border-bottom: 2px solid #22D3EE !important; 
        background: rgba(34, 211, 238, 0.1) !important; 
    }
    .hover-scale:hover { transform: scale(1.02); }
  `}</style>
);

export function NewSponsorDashboard() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { contestants, isLoading: contestantsLoading, refetch: refetchContestants } = useContestantRegistrations();
  
  const [rules, setRules] = useState("");
  const [manualContestants, setManualContestants] = useState<string[]>([]);
  const [newContestantAddress, setNewContestantAddress] = useState("");
  const [prizeAmount, setPrizeAmount] = useState("1000000000");
  const [competitionId, setCompetitionId] = useState("");
  const [teamConfigs, setTeamConfigs] = useState("");
  const [distributionCompetitionId, setDistributionCompetitionId] = useState("");
  const [winningTeamId, setWinningTeamId] = useState("");
  const [winnerAddresses, setWinnerAddresses] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastCompetitionId, setLastCompetitionId] = useState("");
  const [sponsorCapId, setSponsorCapId] = useState("");
  const [isSearchingSponsorCap, setIsSearchingSponsorCap] = useState(true);
  const [sponsorCapError, setSponsorCapError] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [createdTeamIds, setCreatedTeamIds] = useState<string[]>([]);
  const [lastDistributionTx, setLastDistributionTx] = useState<{ digest: string; winners: string[]; prizePerWinner: string } | null>(null);
  const [generatedTeamCount, setGeneratedTeamCount] = useState<number>(0);

  // Query team data when winningTeamId is entered
  const { data: teamData, isLoading: teamLoading } = useSuiClientQuery(
    "getObject",
    {
      id: winningTeamId,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!winningTeamId && winningTeamId.startsWith("0x"),
    }
  );

  // Auto-fill winner addresses when team is loaded
  useEffect(() => {
    
    if (teamData?.data?.content && "fields" in teamData.data.content) {
      const fields = teamData.data.content.fields as any;
      
      if (fields.members && Array.isArray(fields.members)) {
        setTeamMembers(fields.members);
        setWinnerAddresses(fields.members.join("\n"));
      } else {
        setTeamMembers([]);
      }
    } else {
      setTeamMembers([]);
      if (!winningTeamId) {
        setWinnerAddresses("");
      }
    }
  }, [teamData, winningTeamId]);

  // Auto-detect SponsorCap from wallet
  useEffect(() => {
    const fetchSponsorCap = async () => {
      if (!account?.address) {
        setIsSearchingSponsorCap(false);
        return;
      }
      
      try {
        setIsSearchingSponsorCap(true);
        setSponsorCapError("");
        
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${PACKAGE_ID}::competition::SponsorCap`,
          },
          options: {
            showContent: true,
            showType: true,
          },
        });

        if (objects.data && objects.data.length > 0) {
          const capId = objects.data[0].data?.objectId;
          if (capId) {
            setSponsorCapId(capId);
          }
        } else {
          setSponsorCapError("No SponsorCap found in your wallet. Please register as Sponsor first.");
        }
      } catch (error: any) {
        console.error("Error fetching SponsorCap:", error);
        setSponsorCapError(`Error detecting SponsorCap: ${error.message}`);
      } finally {
        setIsSearchingSponsorCap(false);
      }
    };

    if (account) {
      fetchSponsorCap();
    }
  }, [account, suiClient]);

  const handleCreateCompetition = async () => {
    if (!account) {
      setMessage("Please connect your wallet");
      return;
    }
    if (!sponsorCapId) {
      setMessage("⚠️ SponsorCap not found. Please register as Sponsor first.");
      return;
    }
    if (!rules) {
      setMessage("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const txb = new Transaction();
      const prizeAmountNum = BigInt(prizeAmount);
      const rulesBytes = Array.from(new TextEncoder().encode(rules));

      // Mint the REWARD coin using the shared registry
      const rewardCoin = txb.moveCall({
        target: `${PACKAGE_ID}::reward::mint_prize`,
        arguments: [
          txb.object(REWARD_REGISTRY_ID), 
          txb.pure.u64(prizeAmountNum)
        ],
      });

      txb.moveCall({
        target: `${PACKAGE_ID}::competition::create_competition`,
        typeArguments: [`${PACKAGE_ID}::reward::REWARD`],
        arguments: [txb.object(sponsorCapId), txb.pure.vector("u8", rulesBytes), rewardCoin],
      });
      
      signAndExecute({ 
        transaction: txb,
      }, {
        onSuccess: async (result: any) => {
          let newCompetitionId = "";
          try {
            await suiClient.waitForTransaction({ digest: result.digest });
            const txDetails = await suiClient.getTransactionBlock({
              digest: result.digest,
              options: {
                showObjectChanges: true,
              }
            });
            if (txDetails.objectChanges) {
              const competitionObject = txDetails.objectChanges.find(
                (change) =>
                  change.type === "created" &&
                  change.objectType.endsWith("::competition::Competition")
              );
              if (competitionObject && "objectId" in competitionObject) {
                newCompetitionId = competitionObject.objectId;
              }
            }
          } catch (error) {
            console.error("❌ RPC Error:", error);
            setMessage("Error fetching transaction details. Please check the transaction on the explorer.");
          }
          
          if (newCompetitionId) {
            setLastCompetitionId(newCompetitionId);
            setCompetitionId(newCompetitionId); 
            setMessage(""); 
          } else {
            setLastCompetitionId(""); 
            setMessage(`⚠️ Competition created but ID not detected automatically.\n\nTransaction: ${result.digest}`);
          }
          setRules("");
          setPrizeAmount("5000000"); 
          setIsLoading(false);
        },
        onError: (error: any) => {
          let errorMsg = error.message || "Unknown error";
          if (errorMsg.includes("Coin balance")) {
            errorMsg = "❌ Insufficient SUI balance for prize + gas fees";
          }
          setMessage(`Error: ${errorMsg}`);
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const generateTeamsAuto = (addresses: string[]): string => {
    if (addresses.length === 0) return "";
    const count = addresses.length;
    let teamSize = 2; 
    
    if (count >= 10 && count <= 20) teamSize = 2;
    else if (count > 20 && count <= 50) teamSize = 4;
    else if (count > 50 && count <= 100) teamSize = 5;
    else if (count > 100) teamSize = 5; 
    else if (count < 10) teamSize = 2;
    
    const teams: string[] = [];
    let remaining = [...addresses];
    
    while (remaining.length > 0) {
        const chunk = remaining.splice(0, teamSize);
        teams.push(chunk.join(", "));
    }
    
    const formattedTeams = teams.map((team, idx) => `Team ${idx + 1}:\n${team}`);
    return formattedTeams.join("\n\n");
  };

  const generateTestContestants = (count: number) => {
    const testAddresses: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      testAddresses.push(`0x${randomHex}`);
    }
    setManualContestants([...manualContestants, ...testAddresses]);
    // alert replaced with custom UI message if possible, but alert kept for logic consistency
    alert(`✅ Generated ${count} test contestant(s)!`);
  };

  const handleSendToTeamConfigurations = () => {
    try {
      const allAddresses = [...contestants.map((c: any) => c.address), ...manualContestants];
      if (allAddresses.length === 0) {
        return alert("No contestants available.");
      }
      const generated = generateTeamsAuto(allAddresses);
      setTeamConfigs(generated);
      const teamCount = (generated.match(/Team \d+:/g) || []).length;
      setGeneratedTeamCount(teamCount);
    } catch (error) {
      console.error("Error generating teams:", error);
      alert("An error occurred while generating teams. Check the console for details.");
    }
  };

  const handleCreateTeams = async () => {
    if (!account || !competitionId || !teamConfigs || !sponsorCapId) {
      setMessage("Please fill in all required fields: Competition ID and Team Configurations are mandatory.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const teams = teamConfigs
        .split(/Team \d+:/)
        .map(teamBlock =>
          teamBlock
            .split(/[\s,\n]+/)
            .map(addr => addr.trim())
            .filter(addr => addr.startsWith("0x"))
        )
        .filter(team => team.length > 0);

      if (teams.length === 0) {
        setMessage("No valid teams found in the configuration. Please format as 'Team 1: 0x..., 0x...'");
        setIsLoading(false);
        return;
      }

      const txb = new Transaction();
      txb.moveCall({
        target: `${PACKAGE_ID}::competition::create_teams`,
        typeArguments: [`${PACKAGE_ID}::reward::REWARD`],
        arguments: [
          txb.object(sponsorCapId),
          txb.object(competitionId),
          txb.pure(bcs.vector(bcs.vector(bcs.Address)).serialize(teams).toBytes()),
        ],
      });

      signAndExecute({ transaction: txb }, {
        onSuccess: async (result: any) => {
          let teamIds: string[] = [];
          try {
            await suiClient.waitForTransaction({ digest: result.digest });
            const txDetails = await suiClient.getTransactionBlock({
              digest: result.digest,
              options: { showObjectChanges: true }
            });

            if (txDetails.objectChanges) {
              const createdTeams = txDetails.objectChanges.filter(
                (c: any) =>
                  c.type === "created" &&
                  c.objectType.endsWith("::competition::Team")
              );
              teamIds = createdTeams.map((team: any) => team.objectId);
            }
          } catch (error) {
            console.error("Error fetching created teams:", error);
          }
          
          setCreatedTeamIds(teamIds);
          setMessage(`✅ Successfully created ${teams.length} team(s)!`);
          setTeamConfigs("");
          setIsLoading(false);
        },
        onError: (error: any) => {
          setMessage(`Error creating teams: ${error.message}`);
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      setMessage(`Error parsing team configurations: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleDistributePrizes = async () => {
    if (!account || !distributionCompetitionId || !winningTeamId || !sponsorCapId) {
      setMessage("Please fill in all distribution fields");
      return;
    }
    const winners = teamMembers.length > 0 
      ? teamMembers 
      : winnerAddresses.split(/[\s,\n]+/).map(a => a.trim()).filter(a => a.startsWith("0x"));

    if (winners.length === 0) {
      setMessage("Please enter a valid Winning Team ID to load team members");
      return;
    }

    let prizePerWinner = "N/A";

    setIsLoading(true);
    setMessage("");
    try {
      const txb = new Transaction();
      txb.moveCall({
        target: `${PACKAGE_ID}::competition::distribute_prizes`,
        typeArguments: [`${PACKAGE_ID}::reward::REWARD`],
        arguments: [txb.object(sponsorCapId), txb.object(distributionCompetitionId), txb.pure.id(winningTeamId), txb.pure.vector("address", winners)],
      });
      signAndExecute({ transaction: txb }, {
        onSuccess: async (result: any) => {
            const verifiedPrizePerWinner = prizePerWinner; 
            setLastDistributionTx({
            digest: result.digest,
            winners: winners,
            prizePerWinner: verifiedPrizePerWinner,
          });
          setMessage(`✅ Prizes successfully distributed to ${winners.length} winner(s)!`);
          setWinnerAddresses("");
          setWinningTeamId("");
          setTeamMembers([]);
          setIsLoading(false);
        },
        onError: (error: any) => {
          setMessage(`Error: ${error.message}`);
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div style={styles.container} className="flex items-center justify-center">
        <Card style={styles.glassCard} size="4">
          <Flex direction="column" gap="4" align="center" style={{ padding: "40px" }}>
            <AlertTriangle size={48} color="#ef4444" className="animate-pulse" />
            <Heading size="6" style={{ color: "#fff" }}>Sponsor Dashboard</Heading>
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
            <Rocket size={32} color="#22D3EE" />
            <Heading size="8" style={styles.neonText}>Sponsor Dashboard</Heading>
          </Flex>
          
          {/* SponsorCap Status Card */}
          <Card style={styles.glassCard}>
            <Flex direction="column" gap="4">
              <Flex align="center" gap="2">
                 <ShieldCheck size={24} color="#60a5fa" />
                 <Heading size="4" style={{ color: "#fff" }}>Sponsor Capability Status</Heading>
              </Flex>
              
              {isSearchingSponsorCap ? (
                <Flex gap="2" align="center">
                  <Spinner size="3" />
                  <Text color="gray">Detecting your SponsorCap...</Text>
                </Flex>
              ) : sponsorCapId ? (
                <Card variant="surface" style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", borderColor: "rgba(34, 211, 238, 0.4)", borderLeft: "4px solid #22D3EE" }}>
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2">
                      <CheckCircle size={18} color="#22D3EE" />
                      <Text size="2" weight="bold" style={{ color: "#22D3EE" }}>Active Sponsor Detected</Text>
                    </Flex>
                    <Text size="1" style={{ fontFamily: "monospace", color: "#94a3b8" }}>{sponsorCapId}</Text>
                    <Text size="1" color="gray">You have full access to create competitions and manage teams.</Text>
                  </Flex>
                </Card>
              ) : (
                <Card variant="surface" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.4)", borderLeft: "4px solid #ef4444" }}>
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2">
                        <AlertTriangle size={18} color="#ef4444" />
                        <Text size="2" weight="bold" style={{ color: "#ef4444" }}>No SponsorCap Found</Text>
                    </Flex>
                    <Text size="1" color="gray">{sponsorCapError || "You need to register as a Sponsor first"}</Text>
                    <Button variant="ghost" color="red" size="1" style={{ justifyContent: "flex-start", padding: 0 }}>
                        Go to Home &gt; Register as Sponsor
                    </Button>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Card>
          
          <Tabs.Root defaultValue="competition">
            <Tabs.List size="2" style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <Tabs.Trigger value="competition" className="tab-trigger">
                <Trophy size={16} style={{ marginRight: 8 }} /> Create Competition
              </Tabs.Trigger>
              <Tabs.Trigger value="teams" className="tab-trigger">
                <Users size={16} style={{ marginRight: 8 }} /> Create Teams
              </Tabs.Trigger>
              <Tabs.Trigger value="distribute" className="tab-trigger">
                <Gift size={16} style={{ marginRight: 8 }} /> Distribute Prizes
              </Tabs.Trigger>
            </Tabs.List>

            <Box pt="4" className="animate-fade-in">
              <Tabs.Content value="competition">
                <Card style={styles.glassCard}>
                  <Flex direction="column" gap="5">
                    <Flex direction="column" gap="1">
                        <Heading size="5" style={{ color: "#fff" }}>Create New Competition</Heading>
                        <Text size="2" color="gray">Set up a new hackathon or event competition on the blockchain.</Text>
                    </Flex>
                    
                    {!sponsorCapId && (
                      <Card style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                        <Flex gap="2" align="center"><Info size={16} color="#f59e0b" /><Text size="2" color="amber">Register as Sponsor first</Text></Flex>
                      </Card>
                    )}
                    
                    <Flex direction="column" gap="3">
                        <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Competition Rules</Text>
                        <TextArea 
                          placeholder="Describe the rules, objectives and evaluation criteria..." 
                          value={rules} 
                          onChange={(e) => setRules(e.target.value)} 
                          rows={4}
                          disabled={!sponsorCapId}
                          style={styles.input}
                        />
                    </Flex>
                    
                    <Flex direction="column" gap="3">
                        <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Prize Amount (REWARD)</Text>
                        <TextField.Root 
                          type="number" 
                          placeholder="1000000000" 
                          value={prizeAmount} 
                          onChange={(e) => setPrizeAmount(e.target.value)} 
                          size="3"
                          disabled={!sponsorCapId}
                          style={styles.input}
                        >
                            <TextField.Slot><Zap size={16} color="#eab308" /></TextField.Slot>
                        </TextField.Root>
                        <Text size="1" color="gray">Amount in minimal units (e.g., 1000 = 1000 RWD)</Text>
                    </Flex>
                    
                    <Button 
                      onClick={handleCreateCompetition} 
                      disabled={isLoading || !sponsorCapId} 
                      size="3"
                      className="hover-scale"
                      style={{ 
                          ...styles.fulcrumButton,
                          opacity: (isLoading || !sponsorCapId) ? 0.6 : 1
                      }}
                    >
                      {isLoading ? <Spinner /> : <><Rocket size={18} /> Launch Competition</>}
                    </Button>
                    
                    {lastCompetitionId && (
                      <Card style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", marginTop: 10 }} className="animate-fade-in">
                        <Flex direction="column" gap="3">
                          <Flex align="center" gap="2">
                            <CheckCircle size={20} color="#10b981" />
                            <Text size="3" weight="bold" style={{ color: "#10b981" }}>Competition Created!</Text>
                          </Flex>
                          <Box style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
                            <Text size="1" color="gray" weight="bold">COMPETITION ID:</Text>
                            <Flex justify="between" align="center">
                                <Text size="2" style={{ fontFamily: "monospace", color: "#4ade80", wordBreak: "break-all" }}>{lastCompetitionId}</Text>
                                <Copy size={14} color="#4ade80" style={{ cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(lastCompetitionId)} />
                            </Flex>
                          </Box>
                        </Flex>
                      </Card>
                    )}
                    
                    {message && !lastCompetitionId && (
                       <Text size="2" style={{ color: message.includes("Error") ? "#ef4444" : "#eab308", whiteSpace: "pre-wrap" }}>{message}</Text>
                    )}
                  </Flex>
                </Card>
              </Tabs.Content>

              <Tabs.Content value="teams">
                <Card style={styles.glassCard}>
                  <Flex direction="column" gap="5">
                    <Flex direction="column" gap="1">
                        <Heading size="5" style={{ color: "#fff" }}>Create Teams</Heading>
                        <Text size="2" color="gray">Organize registered contestants into competing teams.</Text>
                    </Flex>
                    
                    {/* Registered Contestants List */}
                    {sponsorCapId && (
                      <Card style={{ backgroundColor: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)" }}>
                        <Flex direction="column" gap="3">
                          <Flex align="center" justify="between">
                            <Flex align="center" gap="2">
                                <Users size={18} color="#94a3b8" />
                                <Text size="2" weight="bold" color="gray">Contestant Pool</Text>
                            </Flex>
                            <Flex gap="2">
                                <Badge color="blue">{contestants.length} from registry</Badge>
                                {manualContestants.length > 0 && <Badge color="orange">+{manualContestants.length} manual</Badge>}
                                <RefreshCw size={14} style={{ cursor: "pointer" }} onClick={() => refetchContestants()} className={contestantsLoading ? "animate-spin" : ""} />
                            </Flex>
                          </Flex>

                          {/* Add Manual */}
                          <Flex gap="2" align="end">
                            <Box flexGrow="1">
                                <Text size="1" weight="bold" color="gray">Add Manual Address</Text>
                                <TextField.Root 
                                    placeholder="0x..." 
                                    value={newContestantAddress} 
                                    onChange={(e) => setNewContestantAddress(e.target.value)}
                                    size="2"
                                    style={styles.input}
                                />
                            </Box>
                            <Button onClick={() => {
                                const addr = newContestantAddress.trim();
                                if (addr.startsWith("0x") && !manualContestants.includes(addr)) {
                                    setManualContestants([...manualContestants, addr]);
                                    setNewContestantAddress("");
                                }
                            }} size="2" variant="soft">
                                <Plus size={16} />
                            </Button>
                          </Flex>
                          
                          {/* Test Generation Tools */}
                          <Card style={{ backgroundColor: "rgba(234, 179, 8, 0.05)", border: "1px dashed rgba(234, 179, 8, 0.3)" }}>
                              <Flex align="center" justify="between">
                                  <Text size="2" color="amber">🧪 Test Mode</Text>
                                  <Flex gap="2">
                                      <Button size="1" color="amber" variant="outline" onClick={() => generateTestContestants(10)}>+10 Test Users</Button>
                                      {manualContestants.length > 0 && (
                                          <Button size="1" color="red" variant="ghost" onClick={() => setManualContestants([])}><Trash2 size={14} /></Button>
                                      )}
                                  </Flex>
                              </Flex>
                          </Card>
                          
                          {/* List */}
                          {(contestants.length > 0 || manualContestants.length > 0) && (
                              <Box style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #334155", borderRadius: 6, padding: 8 }}>
                                  {contestants.map((c: any, i: number) => (
                                      <Flex key={i} justify="between" className="mb-1 p-1 hover:bg-white/5 rounded">
                                          <Text size="1" color="gray" style={{ fontFamily: "monospace" }}>{c.address.slice(0,6)}...{c.address.slice(-4)}</Text>
                                          <Badge size="1" color="blue" variant="outline">Reg</Badge>
                                      </Flex>
                                  ))}
                                  {manualContestants.map((m, i) => (
                                      <Flex key={i + 1000} justify="between" className="mb-1 p-1 hover:bg-white/5 rounded">
                                          <Text size="1" color="gray" style={{ fontFamily: "monospace" }}>{m.slice(0,6)}...{m.slice(-4)}</Text>
                                          <Badge size="1" color="orange" variant="outline">Man</Badge>
                                      </Flex>
                                  ))}
                              </Box>
                          )}
                          
                          <Button 
                            variant="soft" 
                            color="cyan" 
                            style={{ width: "100%" }} 
                            onClick={handleSendToTeamConfigurations}
                            className="hover-scale"
                          >
                             <Wand2 size={16} /> Auto-Generate Teams from Pool
                          </Button>
                        </Flex>
                      </Card>
                    )}

                    <Separator size="4" style={{ backgroundColor: "#334155" }} />

                    <Flex direction="column" gap="3">
                        <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Target Competition ID</Text>
                        <TextField.Root 
                          placeholder="Paste Competition ID here..." 
                          value={competitionId} 
                          onChange={(e) => setCompetitionId(e.target.value)} 
                          size="3"
                          disabled={!sponsorCapId}
                          style={styles.input}
                        >
                             <TextField.Slot><Search size={16} color="gray" /></TextField.Slot>
                        </TextField.Root>
                    </Flex>
                    
                    <Flex direction="column" gap="3">
                        <Flex justify="between">
                             <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Team Configurations</Text>
                             <Text size="1" color="gray">{generatedTeamCount} teams defined</Text>
                        </Flex>
                        <TextArea 
                          placeholder={"Team 1:\n0x123..., 0x456...\n\nTeam 2:\n0x789..., 0xabc..."} 
                          value={teamConfigs} 
                          onChange={(e) => {
                             setTeamConfigs(e.target.value);
                             setGeneratedTeamCount((e.target.value.match(/Team \d+:/g) || []).length);
                          }} 
                          rows={8}
                          disabled={!sponsorCapId}
                          style={{ ...styles.input, fontFamily: "monospace", fontSize: "12px" }}
                        />
                    </Flex>
                    
                    <Button 
                      onClick={handleCreateTeams} 
                      disabled={isLoading || !sponsorCapId} 
                      size="3"
                      className="hover-scale"
                      style={styles.fulcrumButton}
                    >
                      {isLoading ? "Creating..." : <><Users size={18} /> Create Teams On-Chain</>}
                    </Button>

                    {createdTeamIds.length > 0 && (
                        <Card style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981" }} className="animate-fade-in">
                            <Text size="3" weight="bold" color="green" className="mb-2 block">✅ Teams Created!</Text>
                            <Flex direction="column" gap="2">
                                {createdTeamIds.map((tid, idx) => (
                                    <Flex key={tid} justify="between" align="center" style={{ background: "rgba(0,0,0,0.3)", padding: 6, borderRadius: 4 }}>
                                        <Text size="1" style={{ fontFamily: "monospace", color: "#86efac" }}>Team {idx+1}: {tid.slice(0,12)}...</Text>
                                        <Copy size={12} color="#86efac" style={{ cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(tid)} />
                                    </Flex>
                                ))}
                            </Flex>
                        </Card>
                    )}
                  </Flex>
                </Card>
              </Tabs.Content>

              <Tabs.Content value="distribute">
                <Card style={styles.glassCard}>
                  <Flex direction="column" gap="5">
                    <Flex direction="column" gap="1">
                        <Heading size="5" style={{ color: "#fff" }}>Distribute Prizes</Heading>
                        <Text size="2" color="gray">Select a winning team and instantly distribute the pool.</Text>
                    </Flex>

                    <Flex direction="column" gap="4">
                        <Box>
                            <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Competition ID</Text>
                            <TextField.Root 
                                value={distributionCompetitionId} 
                                onChange={(e) => setDistributionCompetitionId(e.target.value)} 
                                size="3"
                                style={styles.input}
                                placeholder="0x..."
                            />
                        </Box>

                        <Box>
                            <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Winning Team ID</Text>
                            <TextField.Root 
                                value={winningTeamId} 
                                onChange={(e) => {
                                    setWinningTeamId(e.target.value);
                                    if (!e.target.value) { setWinnerAddresses(""); setTeamMembers([]); }
                                }} 
                                size="3"
                                style={styles.input}
                                placeholder="0x..."
                            >
                                <TextField.Slot>
                                    {teamLoading ? <Spinner size="1" /> : <Trophy size={16} color={teamMembers.length > 0 ? "#4ade80" : "gray"} />}
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>
                        
                        {teamMembers.length > 0 && (
                            <Card style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981" }} className="animate-fade-in">
                                <Flex align="center" gap="2">
                                    <Users size={16} color="#10b981" />
                                    <Text size="2" color="green">{teamMembers.length} members loaded automatically.</Text>
                                </Flex>
                            </Card>
                        )}

                        <Box>
                            <Flex justify="between" className="mb-1">
                                <Text size="2" weight="bold" style={{ color: "#60a5fa" }}>Winner Addresses</Text>
                                <Text size="1" color="gray">Split equally</Text>
                            </Flex>
                            <TextArea 
                                value={winnerAddresses} 
                                onChange={(e) => setWinnerAddresses(e.target.value)} 
                                rows={6}
                                disabled={!sponsorCapId}
                                style={{ ...styles.input, fontFamily: "monospace", fontSize: "12px" }}
                            />
                        </Box>

                        <Button 
                            onClick={handleDistributePrizes} 
                            disabled={isLoading} 
                            size="4" 
                            className="hover-scale animate-glow"
                            style={styles.fulcrumButton}
                        >
                            {isLoading ? <Spinner /> : <><Gift size={24} style={{ marginRight: 8 }} /> Distribute Prizes</>}
                        </Button>
                    </Flex>

                    {lastDistributionTx && (
                        <Card style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981" }} className="animate-fade-in">
                             <Flex direction="column" gap="3">
                                 <Flex align="center" gap="2">
                                     <CheckCircle size={24} color="#4ade80" />
                                     <Heading size="4" style={{ color: "#4ade80" }}>Distribution Complete!</Heading>
                                 </Flex>
                                 <Text size="2" color="gray">
                                     Sent <span style={{ color: "#fff", fontWeight: "bold" }}>{lastDistributionTx.prizePerWinner}</span> to each of the {lastDistributionTx.winners.length} winners.
                                 </Text>
                                 <a 
                                    href={`https://suiscan.xyz/testnet/tx/${lastDistributionTx.digest}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    style={{ color: "#60a5fa", textDecoration: "underline", fontSize: "14px", display: "flex", alignItems: "center", gap: 5 }}
                                 >
                                     View Transaction <Search size={12} />
                                 </a>
                             </Flex>
                        </Card>
                    )}
                  </Flex>
                </Card>
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          <Flex justify="center" className="mt-4">
             <Badge color="gray" variant="surface" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                 <Flex gap="2" align="center">
                     <Info size={12} />
                     Connected: {account.address.slice(0,6)}...{account.address.slice(-4)}
                 </Flex>
             </Badge>
          </Flex>

        </Flex>
      </div>
    </div>
  );
}