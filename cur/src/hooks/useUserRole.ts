// src/hooks/useUserRole.ts
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { DEVELOPER_ADDRESS } from "../config/constants";

export type UserRole = "developer" | "sponsor" | "contestant" | null;

export function useUserRole() {
  const account = useCurrentAccount();

  // Special case for the developer address
  if (account?.address === DEVELOPER_ADDRESS) {
    return {
      role: "developer" as UserRole,
      isLoading: false,
      isConnected: true,
    };
  }

  // Fetch all objects owned by the user
  const { data: objects, isLoading, isError } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showType: true,
      },
    },
    {
      enabled: !!account?.address,
    }
  );

  // Determine user role based on owned capabilities
  const role: UserRole = (() => {
    if (isLoading || isError || !objects?.data) {
      return null;
    }

    try {
      // Check for SponsorCap
      if (objects.data.some((obj) => obj.data?.type?.includes("SponsorCap"))) {
        return "sponsor";
      }

      // Check for ContestantCap
      if (objects.data.some((obj) => obj.data?.type?.includes("ContestantCap"))) {
        return "contestant";
      }
      
      // Check for DeveloperCap (should not happen due to the special case, but good to have)
      if (objects.data.some((obj) => obj.data?.type?.includes("DeveloperCap"))) {
        return "developer";
      }

    } catch (error) {
      console.error("Error determining user role:", error);
      return null;
    }

    return null;
  })();

  return {
    role,
    isLoading,
    isConnected: !!account,
  };
}
