// Carries the selected branch through the flow in the URL search params,
// since branch locations are looked up live instead of stored in sample data.
export const branchSearchParams = (branch) => ({
  branch: branch.name,
  address: branch.address,
  wait: branch.wait,
  tier: branch.waitTier,
  hours: branch.hours,
});

export const branchFromSearch = (search) => {
  if (!search.branch || !search.address) return null;
  return {
    id: search.branch,
    name: search.branch,
    address: search.address,
    wait: search.wait || "",
    waitTier: search.tier || "short",
    hours: search.hours || "",
  };
};

export const branchSearchSchema = {
  branch: (value) => (typeof value === "string" ? value : undefined),
};