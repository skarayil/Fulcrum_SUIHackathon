import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { Card, Button, TextField, Flex, Text, Heading, TextArea, Badge } from "@radix-ui/themes";
import { PACKAGE_ID } from "../config/constants";

export function ContestantDashboard() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // Team info state (would be fetched from blockchain in real app)
  const [teamId, setTeamId] = useState("");
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  
  // Vote creation state
  const [voteQuestion, setVoteQuestion] = useState("");
  const [voteOptions, setVoteOptions] = useState("");
  
  // Vote casting state
  const [selectedVoteId, setSelectedVoteId] = useState("");
  const [voteChoice, setVoteChoice] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // In a real app, you would fetch this data from blockchain
  const loadTeamInfo = async () => {
    // Mock data for demonstration
    setTeamId("0x123...");
    setIsTeamLeader(true);
    setTeamMembers(["0xabc...", "0xdef...", "0xghi..."]);
  };

  const handleInitiateVote = async () => {
    if (!account || !teamId) {
      setMessage("Please connect your wallet and load your team info");
      return;
    }

    if (!isTeamLeader) {
      setMessage("Only team leaders can initiate a vote");
      return;
    }

    if (!voteQuestion || !voteOptions) {
      setMessage("Please enter the question and options");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const txb = new Transaction();
      
      const contestantCapId = "YOUR_CONTESTANT_CAP_OBJECT_ID";
      
      const options = voteOptions
        .split("\n")
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0)
        .map(opt => Array.from(new TextEncoder().encode(opt)));

      const questionBytes = Array.from(new TextEncoder().encode(voteQuestion));

      txb.moveCall({
        target: `${PACKAGE_ID}::competition::initiate_vote`,
        arguments: [
          txb.object(contestantCapId),
          txb.object(teamId),
          txb.pure.vector("u8", questionBytes),
          txb.pure(bcs.vector(bcs.vector(bcs.U8)).serialize(options).toBytes()),
        ],
      });

      signAndExecute(
        { transaction: txb },
        {
          onSuccess: (result: any) => {
            console.log("Vote initiated:", result);
            setMessage("Vote initiated successfully!");
            setVoteQuestion("");
            setVoteOptions("");
            setIsLoading(false);
          },
          onError: (error: any) => {
            console.error("Vote initiation error:", error);
            setMessage(`Error: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleCastVote = async () => {
    if (!account) {
      setMessage("Please connect your wallet");
      return;
    }

    if (!selectedVoteId || !voteChoice) {
      setMessage("Please enter the vote ID and your choice");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const txb = new Transaction();
      
      const contestantCapId = "YOUR_CONTESTANT_CAP_OBJECT_ID";
      const choice = parseInt(voteChoice);

      txb.moveCall({
        target: `${PACKAGE_ID}::competition::cast_vote`,
        arguments: [
          txb.object(contestantCapId),
          txb.object(selectedVoteId),
          txb.pure.u64(choice),
        ],
      });

      signAndExecute(
        { transaction: txb },
        {
          onSuccess: (result: any) => {
            console.log("Vote cast:", result);
            setMessage("Your vote has been recorded successfully!");
            setSelectedVoteId("");
            setVoteChoice("");
            setIsLoading(false);
          },
          onError: (error: any) => {
            console.error("Vote casting error:", error);
            setMessage(`Error: ${error.message}`);
            setIsLoading(false);
          },
        }
      );
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <Flex direction="column" gap="3" align="center">
            <Heading size="6">Contestant Dashboard</Heading>
            <Text color="red">Please connect your wallet</Text>
          </Flex>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Flex direction="column" gap="6">
        <Heading size="8" className="text-center">Contestant Dashboard</Heading>
        
        {/* Team Info Card */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Team Information</Heading>
            <Flex direction="column" gap="2">
              <Text size="2">
                <strong>Team ID:</strong> {teamId || "Not loaded"}
              </Text>
              <Flex gap="2" align="center">
                <Text size="2"><strong>Role:</strong></Text>
                {isTeamLeader ? (
                  <Badge color="blue">Team Leader</Badge>
                ) : (
                  <Badge color="gray">Team Member</Badge>
                )}
              </Flex>
              {teamMembers.length > 0 && (
                <div>
                  <Text size="2" weight="bold">Team Members:</Text>
                  <ul className="list-disc list-inside">
                    {teamMembers.map((member, idx) => (
                      <li key={idx}>
                        <Text size="1" style={{ fontFamily: "monospace" }}>
                          {member}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button onClick={loadTeamInfo} variant="soft" size="2">
                Load Team Info
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Initiate Vote Card - Only for Team Leaders */}
        {isTeamLeader && (
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Initiate Vote</Heading>
              <Text size="2" color="gray">
                Only team leaders can start a new vote
              </Text>
              <label>
                <Text size="2" weight="bold">Team ID</Text>
                <TextField.Root
                  placeholder="0x..."
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  size="3"
                />
              </label>
              <label>
                <Text size="2" weight="bold">Vote Question</Text>
                <TextField.Root
                  placeholder="Which feature should we improve?"
                  value={voteQuestion}
                  onChange={(e) => setVoteQuestion(e.target.value)}
                  size="3"
                />
              </label>
              <label>
                <Text size="2" weight="bold">Options (one per line)</Text>
                <TextArea
                  placeholder={"Option 1\nOption 2\nOption 3"}
                  value={voteOptions}
                  onChange={(e) => setVoteOptions(e.target.value)}
                  rows={5}
                />
              </label>
              <Button
                onClick={handleInitiateVote}
                disabled={isLoading}
                size="3"
              >
                {isLoading ? "Starting..." : "Initiate Vote"}
              </Button>
            </Flex>
          </Card>
        )}

        {/* Cast Vote Card - For All Team Members */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Cast Vote</Heading>
            <Text size="2" color="gray">
              Participate in active votes
            </Text>
            <label>
              <Text size="2" weight="bold">Vote ID</Text>
              <TextField.Root
                placeholder="0x..."
                value={selectedVoteId}
                onChange={(e) => setSelectedVoteId(e.target.value)}
                size="3"
              />
            </label>
            <label>
              <Text size="2" weight="bold">Your Choice (Option number: 0, 1, 2...)</Text>
              <TextField.Root
                type="number"
                placeholder="0"
                value={voteChoice}
                onChange={(e) => setVoteChoice(e.target.value)}
                size="3"
              />
            </label>
            <Button
              onClick={handleCastVote}
              disabled={isLoading}
              size="3"
            >
              {isLoading ? "Casting..." : "Cast Vote"}
            </Button>
          </Flex>
        </Card>

        {message && (
          <Card>
            <Text
              color={message.includes("successfully") ? "green" : "red"}
              size="3"
              weight="bold"
            >
              {message}
            </Text>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Info</Heading>
            <Text size="2">
              This panel can only be used by wallets with a ContestantCap.
            </Text>
            <Text size="2">
              • Team leaders can initiate new votes
            </Text>
            <Text size="2">
              • All team members can participate in active votes
            </Text>
            <Text size="2" color="gray">
              Connected Wallet: {account.address}
            </Text>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
