import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Card, Button, TextField, Flex, Text, Heading, Select } from "@radix-ui/themes";
import { PACKAGE_ID, DEVELOPER_CAP_ID } from "../config/constants";

export function DeveloperDashboard() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [userAddress, setUserAddress] = useState("");
  const [roleType, setRoleType] = useState<"sponsor" | "contestant">("sponsor");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAssignRole = async () => {
    if (!account) {
      setMessage("Please connect your wallet");
      return;
    }

    if (!userAddress) {
      setMessage("Please enter a user address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const txb = new Transaction();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::competition::assign_role`,
        arguments: [
          txb.object(DEVELOPER_CAP_ID),
          txb.pure.address(userAddress),
          txb.pure.bool(roleType === "sponsor"),
        ],
      });

      signAndExecute(
        { transaction: txb },
        {
          onSuccess: (result: any) => {
            console.log("Role assignment successful:", result);
            setMessage(`${roleType === "sponsor" ? "Sponsor" : "Contestant"} role assigned successfully!`);
            setUserAddress("");
          },
          onError: (error: any) => {
            console.error("Role assignment error:", error);
            setMessage(`Error: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <Flex direction="column" gap="3" align="center">
            <Heading size="6">Developer Dashboard</Heading>
            <Text color="red">Please connect your wallet</Text>
          </Flex>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Flex direction="column" gap="6">
        <Heading size="8" className="text-center">Developer Dashboard</Heading>
        
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Role Assignment</Heading>
            <Text color="gray">
              Assign Sponsor or Contestant role to users
            </Text>

            <Flex direction="column" gap="3">
              <label>
                <Text size="2" weight="bold">User Address</Text>
                <TextField.Root
                  placeholder="0x..."
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  size="3"
                />
              </label>

              <label>
                <Text size="2" weight="bold">Role Type</Text>
                <Select.Root value={roleType} onValueChange={(value) => setRoleType(value as "sponsor" | "contestant")}>
                  <Select.Trigger placeholder="Select role" />
                  <Select.Content>
                    <Select.Item value="sponsor">Sponsor</Select.Item>
                    <Select.Item value="contestant">Contestant</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>

              <Button
                onClick={handleAssignRole}
                disabled={isLoading || !userAddress}
                size="3"
                style={{ cursor: isLoading ? "wait" : "pointer" }}
              >
                {isLoading ? "Processing..." : "Assign Role"}
              </Button>

              {message && (
                <Text
                  color={message.includes("successfully") ? "green" : "red"}
                  size="2"
                  weight="bold"
                >
                  {message}
                </Text>
              )}
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Information</Heading>
            <Text size="2">
              This panel can only be used by wallets that own DeveloperCap.
              You can assign sponsor or contestant roles to users.
            </Text>
            <Text size="2" color="gray">
              Connected Wallet: {account.address}
            </Text>
            <Text size="2" color="blue">
              DeveloperCap ID: {DEVELOPER_CAP_ID.slice(0, 20)}...
            </Text>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}