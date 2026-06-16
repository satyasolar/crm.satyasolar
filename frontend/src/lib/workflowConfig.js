// frontend/src/lib/workflowConfig.js
// Centralized workflow engine configuration for CRM simplification demo.

export const DEPARTMENTS = {
  SALES: "Sales",
  REGISTRATION: "Registration",
  BANKING_FINANCE: "Banking & Finance",
  PROJECT_PHASE_1: "Project Phase 1",
  WAREHOUSE: "Warehouse",
  PROJECT_PHASE_2: "Project Phase 2",
  ELECTRICAL: "Electrical",
  PROJECT_PHASE_3: "Project Phase 3",
  QA_QC: "Quality Assurance",
  ACCOUNTS: "Accounts",
  SUBSIDY: "Subsidy",
  CUSTOMER_SERVICE_AMC: "Customer Service / AMC",
  PROJECT_CLOSED: "Project Closed",
};

export const WORKFLOW_CONFIG = [
  {
    id: DEPARTMENTS.SALES,
    name: "Sales Department",
    subSteps: ["Customer Details", "Quotation", "Document Upload"],
    next: (caseData) => DEPARTMENTS.REGISTRATION,
  },
  {
    id: DEPARTMENTS.REGISTRATION,
    name: "Registration Department",
    subSteps: ["Document Verification", "Govt Portal Registration", "Payment Mode Verification"],
    next: (caseData) => {
      const paymentMode = (caseData.payment_type || caseData.paymentType || "").toLowerCase();
      if (paymentMode === "cash") {
        return DEPARTMENTS.PROJECT_PHASE_1;
      }
      return DEPARTMENTS.BANKING_FINANCE;
    },
  },
  {
    id: DEPARTMENTS.BANKING_FINANCE,
    name: "Banking & Finance Department",
    subSteps: ["Loan Processing", "Bank Approval", "Documentation", "Sanction", "Disbursement"],
    next: (caseData) => DEPARTMENTS.PROJECT_PHASE_1,
  },
  {
    id: DEPARTMENTS.PROJECT_PHASE_1,
    name: "Project Department (Phase 1)",
    subSteps: [
      "Site Survey",
      "Design Preparation",
      "BOM Approval",
      "Structure Team Assignment",
      "Structure Installation",
      "GPS Photo Upload",
      "Structure Verification",
    ],
    next: (caseData) => DEPARTMENTS.WAREHOUSE,
  },
  {
    id: DEPARTMENTS.WAREHOUSE,
    name: "Warehouse Department",
    subSteps: [
      "Material Request Receive",
      "Panel Issue",
      "Inverter Issue",
      "Structure Balance Material",
      "Serial Number Allocation",
      "Dispatch Approval",
    ],
    next: (caseData) => DEPARTMENTS.PROJECT_PHASE_2,
  },
  {
    id: DEPARTMENTS.PROJECT_PHASE_2,
    name: "Project Department (Phase 2)",
    subSteps: [
      "Installation Team Assignment",
      "Panel Installation",
      "Inverter Installation",
      "AC/DC Work",
      "Final Site Photos",
      "Installation Completion",
    ],
    next: (caseData) => DEPARTMENTS.ELECTRICAL,
  },
  {
    id: DEPARTMENTS.ELECTRICAL,
    name: "Electrical Department",
    subSteps: [
      "Serial Number Verification",
      "UPPCL Application",
      "Net Metering Process",
      "Inspection Coordination",
      "Net Meter Approval",
    ],
    next: (caseData) => DEPARTMENTS.PROJECT_PHASE_3,
  },
  {
    id: DEPARTMENTS.PROJECT_PHASE_3,
    name: "Project Department (Phase 3)",
    subSteps: ["Plant Activation Assignment", "Final Commissioning", "Generation Verification", "Plant Activated"],
    next: (caseData) => DEPARTMENTS.QA_QC,
  },
  {
    id: DEPARTMENTS.QA_QC,
    name: "Quality Assurance Department",
    subSteps: ["Installation Quality Check", "Safety Verification", "GPS Verification", "Customer Satisfaction Check", "QA Approval"],
    next: (caseData) => DEPARTMENTS.ACCOUNTS,
  },
  {
    id: DEPARTMENTS.ACCOUNTS,
    name: "Accounts Department",
    subSteps: ["Final Invoice", "Pending Amount Collection", "Payment Verification", "Receipt Generation", "Financial Closure"],
    next: (caseData) => DEPARTMENTS.SUBSIDY,
  },
  {
    id: DEPARTMENTS.SUBSIDY,
    name: "Subsidy Department",
    subSteps: ["Subsidy Application", "Reference Number", "Follow-up", "Approval Tracking", "Subsidy Closure"],
    next: (caseData) => DEPARTMENTS.CUSTOMER_SERVICE_AMC,
  },
  {
    id: DEPARTMENTS.CUSTOMER_SERVICE_AMC,
    name: "Customer Service / AMC",
    subSteps: ["Warranty Activation", "AMC Activation", "Insurance Management", "Service Support", "Complaint Handling", "Periodic Follow-up"],
    next: (caseData) => DEPARTMENTS.PROJECT_CLOSED,
  },
  {
    id: DEPARTMENTS.PROJECT_CLOSED,
    name: "Project Closed",
    subSteps: [],
    next: (caseData) => null,
  },
];

// Legacy stages to clean simplified stages mapping
export const LEGACY_STAGE_MAP = {
  "Case Confirmed": DEPARTMENTS.SALES,
  "Registration: Document Verification": DEPARTMENTS.REGISTRATION,
  "Registration: Government Portal": DEPARTMENTS.REGISTRATION,
  "Registration: Payment Verification": DEPARTMENTS.REGISTRATION,
  "Bank & Finance": DEPARTMENTS.BANKING_FINANCE,
  "Project: Survey & Design": DEPARTMENTS.PROJECT_PHASE_1,
  "Warehouse: Material Dispatch": DEPARTMENTS.WAREHOUSE,
  "Project: Installation": DEPARTMENTS.PROJECT_PHASE_2,
  "Electrical: Net Metering": DEPARTMENTS.ELECTRICAL,
  "Accounts: Payment Clearance": DEPARTMENTS.ACCOUNTS,
  "Subsidy Registration": DEPARTMENTS.SUBSIDY,
  "Customer Service Update": DEPARTMENTS.CUSTOMER_SERVICE_AMC,
  "Project Completed": DEPARTMENTS.PROJECT_CLOSED,
  "Completed": DEPARTMENTS.PROJECT_CLOSED,
};

// Returns the normalized department ID (handles backward compatibility with legacy stages)
export function getNormalizedDept(stageName) {
  if (!stageName) return DEPARTMENTS.SALES;
  return LEGACY_STAGE_MAP[stageName] || stageName;
}

// Generate the list of sequential departments for a specific case's path
export function getWorkflowPath(caseData = {}) {
  const path = [];
  let currentDeptId = DEPARTMENTS.SALES;
  
  // Guard against circular paths (safety first)
  const visited = new Set();
  
  while (currentDeptId && !visited.has(currentDeptId)) {
    let dept = null;
    for (let i = 0; i < WORKFLOW_CONFIG.length; i++) {
      if (WORKFLOW_CONFIG[i].id === currentDeptId) {
        dept = WORKFLOW_CONFIG[i];
        break;
      }
    }
    if (!dept) break;
    path.push(dept);
    visited.add(currentDeptId);
    currentDeptId = dept.next(caseData);
  }
  return path;
}

// Calculate the progress percentage (completed stages / total stages in path)
export function calculateProgress(caseData = {}) {
  const path = getWorkflowPath(caseData);
  const currentStageName = caseData.current_stage || caseData.currentStage || DEPARTMENTS.SALES;
  const currentDept = getNormalizedDept(currentStageName);
  const currentIdx = path.findIndex(d => d.id === currentDept);
  
  if (currentIdx === -1) return 0;
  if (currentDept === DEPARTMENTS.PROJECT_CLOSED) return 100;
  
  const total = path.length;
  const completed = currentIdx;
  return Math.round((completed / total) * 100);
}

// Find the next stage dynamically based on configuration
export function getNextDept(caseData = {}) {
  const currentStageName = caseData.current_stage || caseData.currentStage || DEPARTMENTS.SALES;
  const currentDept = getNormalizedDept(currentStageName);
  const deptConfig = WORKFLOW_CONFIG.find(d => d.id === currentDept);
  
  if (!deptConfig) return null;
  return deptConfig.next(caseData);
}
