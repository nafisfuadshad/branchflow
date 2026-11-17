import { useEffect, useState } from "react";
import { getBranchStatus } from "@/lib/branchStatus";

// Resolves open/closed after mount (never during render), so the server-rendered
// page and the browser agree, and refreshes once a minute.
export default function useBranchStatus(schedule) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return now ? getBranchStatus(schedule, now) : null;
}