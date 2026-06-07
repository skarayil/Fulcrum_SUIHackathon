import { useSuiClientQuery } from "@mysten/dapp-kit";
import { CONTESTANT_REGISTRY_ID } from "../config/constants";

export function useContestantRegistrations() {
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: CONTESTANT_REGISTRY_ID,
      options: {
        showContent: true,
      },
    }
  );

  console.log("🔍 ContestantRegistry data:", data);

  let contestants: any[] = [];
  
  if (data?.data?.content && "fields" in data.data.content) {
    const fields = data.data.content.fields as any;
    console.log("Registry fields:", fields);
    
    if (fields.contestants && Array.isArray(fields.contestants)) {
      contestants = fields.contestants.map((address: string) => ({
        address,
        capId: "", // We don't have cap_id from registry
        timestamp: null,
      }));
    }
  }

  console.log("✅ Contestants from registry:", contestants);

  return { 
    contestants, 
    isLoading, 
    error, 
    refetch 
  };
}
