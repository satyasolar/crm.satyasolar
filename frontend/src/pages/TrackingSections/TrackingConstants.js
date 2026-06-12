export const STAGES = [
  { key: "Registration Done", label: "Registered", icon: "how_to_reg" },
  { key: "Phone Verification Done", label: "Verified", icon: "verified" },
  { key: "Bank & Finance", label: "Banking", icon: "account_balance" },
  { key: "Sent to Store", label: "Inventory", icon: "inventory_2" },
  { key: "Installation Done", label: "Installed", icon: "construction" },
  { key: "Plant Activated", label: "Activated", icon: "bolt" },
  { key: "Completed", label: "Completed", icon: "task_alt" },
];

export const stageIndex = (stage) => {
  const map = {
    "Registration Done": 0,
    "Phone Verification Done": 1,
    "Bank & Finance": 2,
    "Sent to Store": 3,
    "Installation Done": 4,
    "Plant Activated": 5,
    "Subsidy Registration Completed": 6,
    Completed: 6,
  };
  return map[stage] ?? -1;
};

export const FEATURES = [
  {
    icon: "sync",
    title: "Live Updates",
    desc: "Real-time status updates as your project moves through each stage of installation.",
  },
  {
    icon: "shield",
    title: "Secure Access",
    desc: "Your personal data stays private. We only show progress — nothing sensitive.",
  },
  {
    icon: "bar_chart",
    title: "Full Visibility",
    desc: "View every milestone from registration to plant activation in one place.",
  },
];
