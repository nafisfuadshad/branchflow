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

export const SAMPLE_ZIPS = ["02108", "02459", "01451"];

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