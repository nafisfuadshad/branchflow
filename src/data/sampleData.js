export const SERVICES = [
  {
    id: "open-account",
    name: "Open an Account",
    description: "Start a new checking or savings account with a banker.",
    duration: "About 30 minutes",
    documents: [
      "Photo ID (driver's license, passport, or state ID)",
      "Social Security Number or Tax ID",
      "Current contact information (address, phone, email)",
    ],
  },
  {
    id: "credit-card-help",
    name: "Credit Card Help",
    description: "Ask about a new card, a limit change, or a card issue.",
    duration: "About 20 minutes",
    documents: [
      "Photo ID",
      "The credit card in question, if you have it",
      "Recent statement or notice you received",
    ],
  },
  {
    id: "personal-loan",
    name: "Personal Loan",
    description: "Talk through loan options and what you qualify for.",
    duration: "About 40 minutes",
    documents: [
      "Photo ID",
      "Proof of income (two recent pay stubs or a benefit letter)",
      "Recent bank statements",
      "Social Security Number",
    ],
  },
  {
    id: "account-maintenance",
    name: "Account Maintenance",
    description: "Update your details, add a person, or fix a problem.",
    duration: "About 15 minutes",
    documents: [
      "Photo ID",
      "Your account number or debit card",
      "Any paperwork related to the change",
    ],
  },
  {
    id: "general-banker",
    name: "General Banker Appointment",
    description: "Not sure what you need? Start here and we'll point you right.",
    duration: "About 15 minutes",
    documents: [
      "Photo ID",
      "Anything you already have about your question",
    ],
  },
];

export const BRANCHES = [
  {
    id: "riverbend",
    name: "Riverbend Branch",
    address: "418 Riverbend Ave, Millbrook, MA 01402",
    hours: "Mon–Fri 9:00 AM – 5:00 PM · Sat 9:00 AM – 1:00 PM",
    wait: "5–10 minutes",
    waitTier: "short",
    zips: ["01402", "01403", "01405"],
  },
  {
    id: "oak-hill",
    name: "Oak Hill Branch",
    address: "22 Oak Hill Plaza, Millbrook, MA 01405",
    hours: "Mon–Fri 8:30 AM – 6:00 PM · Sat 9:00 AM – 2:00 PM",
    wait: "10–20 minutes",
    waitTier: "medium",
    zips: ["01405", "01406", "01402"],
  },
  {
    id: "harbor-point",
    name: "Harbor Point Branch",
    address: "905 Harbor Point Rd, Millbrook, MA 01408",
    hours: "Mon–Fri 9:00 AM – 4:30 PM · Closed Sat",
    wait: "20–30 minutes",
    waitTier: "long",
    zips: ["01408", "01407"],
  },
  {
    id: "cedar-grove",
    name: "Cedar Grove Branch",
    address: "77 Cedar Grove Ln, Millbrook, MA 01406",
    hours: "Mon–Fri 9:00 AM – 5:00 PM · Sat 10:00 AM – 1:00 PM",
    wait: "0–5 minutes",
    waitTier: "short",
    zips: ["01406", "01405"],
  },
  {
    id: "northfield",
    name: "Northfield Branch",
    address: "310 Northfield St, Millbrook, MA 01407",
    hours: "Mon–Fri 9:30 AM – 5:30 PM · Closed Sat",
    wait: "15–25 minutes",
    waitTier: "medium",
    zips: ["01407", "01408", "01402"],
  },
];

export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
];

export const findService = (id) => SERVICES.find((s) => s.id === id) || null;

export const findBranch = (id) => BRANCHES.find((b) => b.id === id) || null;

export const branchesForZip = (zip) =>
  zip ? BRANCHES.filter((b) => b.zips.includes(zip)) : [];

export const SAMPLE_ZIPS = [...new Set(BRANCHES.flatMap((b) => b.zips))].sort();

export const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const todayISO = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};