import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID } from "../config/constants";

export function useRegisteredContestants() {
  // Query all ContestantCap objects
  const { data: contestantCaps, isLoading, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: PACKAGE_ID, // This won't work - we need to query differently
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    },
    {
      enabled: false, // Disable this approach
    }
  );

  // For now, return empty until we implement proper indexing
  console.log("⚠️ useRegisteredContestants: This hook needs backend/indexer support");
  console.log("ContestantCap objects are owned by users, not queryable by type alone");
  
  return {
    contestants: [],
    isLoading: false,
    error: new Error("ContestantCap indexing not implemented. Need to track registrations via events or off-chain indexer."),
    refetch,
  };
}

