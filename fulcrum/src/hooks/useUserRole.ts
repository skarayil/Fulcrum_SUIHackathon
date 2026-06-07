// src/hooks/useUserRole.ts
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { DEVELOPER_ADDRESS } from "../config/constants";

export type UserRole = "developer" | "sponsor" | "contestant" | null;

export function useUserRole() {
  const account = useCurrentAccount();

  // Fetch all objects owned by the user
  const { data: objects, isLoading } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showType: true,
        showContent: true,
      },
    },
    {
      enabled: !!account?.address && account.address !== DEVELOPER_ADDRESS,
    }
  );

  // Check if this is the special developer wallet (after all hooks)
  if (account?.address === DEVELOPER_ADDRESS) {
    return {
      role: "developer" as UserRole,
      isLoading: false,
      isConnected: true,
    };
  }

  // Determine user role based on owned capabilities
  const role: UserRole = (() => {
    if (!objects || !objects.data || objects.data.length === 0) {
      return null;
    }

    // Check for DeveloperCap
    const hasDeveloperCap = objects.data.some((obj) =>
      obj.data?.type?.includes("DeveloperCap")
    );
    if (hasDeveloperCap) return "developer";

    // Check for SponsorCap
    const hasSponsorCap = objects.data.some((obj) =>
      obj.data?.type?.includes("SponsorCap")
    );
    if (hasSponsorCap) return "sponsor";

    // Check for ContestantCap
    const hasContestantCap = objects.data.some((obj) =>
      obj.data?.type?.includes("ContestantCap")
    );
    if (hasContestantCap) return "contestant";

    return null;
  })();

  return {
    role,
    isLoading,
    isConnected: !!account,
  };
}

