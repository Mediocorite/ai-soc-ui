import type {
  Analyst,
  Incident,
  TimelineEvent,
  Alert,
  RiskMetric,
  RawSecurityData,
  IncidentHighlight,
} from "../../../types/dashboard";
import {
  AnalystStatus,
  Severity,
  IncidentStatus,
} from "../../../types/dashboard";

// --- Constants ---
export const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.CRITICAL]: "bg-red-500/10 text-red-400 border-red-500/20",
  [Severity.HIGH]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  [Severity.MEDIUM]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  [Severity.LOW]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  [Severity.CRITICAL]: 0,
  [Severity.HIGH]: 1,
  [Severity.MEDIUM]: 2,
  [Severity.LOW]: 3,
};

// --- SOC Lead Mock Data ---
export const MOCK_ANALYSTS: Analyst[] = [
  {
    id: "a1",
    name: "Sarah Jenkins",
    status: AnalystStatus.BUSY,
    activeIncidents: 3,
    avgResponseTime: "14m",
    role: "Senior Analyst",
  },
  {
    id: "a2",
    name: "Michael Chen",
    status: AnalystStatus.AVAILABLE,
    activeIncidents: 1,
    avgResponseTime: "11m",
    role: "Security Researcher",
  },
  {
    id: "a3",
    name: "Elena Rodriguez",
    status: AnalystStatus.BUSY,
    activeIncidents: 4,
    avgResponseTime: "22m",
    role: "L1 Analyst",
  },
  {
    id: "a4",
    name: "David Kim",
    status: AnalystStatus.AWAY,
    activeIncidents: 0,
    avgResponseTime: "18m",
    role: "Incident Responder",
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-2024-001",
    title: "Potential Ransomware Execution - Finance DB",
    severity: Severity.CRITICAL,
    status: IncidentStatus.ESCALATED,
    analystId: "a1",
    openedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    slaDeadline: new Date(Date.now() + 15 * 60000).toISOString(),
    category: "Malware",
    summary:
      "Detected multiple unauthorized encryption attempts on the primary financial database server. Host isolation initiated.",
  },
  {
    id: "INC-2024-002",
    title: "Brute Force Attack - VPN Gateway",
    severity: Severity.HIGH,
    status: IncidentStatus.INVESTIGATING,
    analystId: "a3",
    openedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    slaDeadline: new Date(Date.now() - 10 * 60000).toISOString(),
    category: "Access Violation",
    summary:
      "Sustained brute force attempt against external VPN gateway from multiple geographic regions.",
  },
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: "e1",
    incidentId: "INC-2024-001",
    type: "SYSTEM_ALERT",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    message: "Alert Triggered: Behavioral detection of File Encryption",
  },
  {
    id: "e2",
    incidentId: "INC-2024-001",
    type: "STATUS_CHANGE",
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    message: "Incident Auto-Created and assigned to Sarah Jenkins",
  },
];

// --- SOC Analyst Mock Data ---
export const MOCK_ALERTS: Alert[] = [
  {
    id: "ALRT-2023-001",
    title: "Anomalous Data Exfiltration to Unauthorized IP",
    severity: Severity.CRITICAL,
    timestamp: "2024-05-20T14:22:10Z",
    confidenceScore: 0.94,
    description:
      "High volume of data detected leaving the internal R&D network destined for a known malicious command and control node.",
    status: "Open",
    entities: [
      { type: "IP", value: "45.12.89.201" },
      { type: "Host", value: "SRV-DATA-PROD-01" },
      { type: "User", value: "j.doe@sentinel.io" },
    ],
    timeline: [
      {
        timestamp: "14:20:05",
        description: "User login from unusual location",
        category: "Identity",
      },
      {
        timestamp: "14:21:12",
        description: "Access to encrypted database partition",
        category: "Process",
      },
      {
        timestamp: "14:22:10",
        description: "Outbound transfer of 4.2GB initiated",
        category: "Network",
      },
    ],
    rawDetails: { source: "CrowdStrike", port: 443, protocol: "HTTPS" },
  },
];

// --- Executive Mock Data ---
export const DOMAIN_RISKS: RiskMetric[] = [
  { domain: "Identity & Access", score: 82, trend: "up", status: "Healthy" },
  {
    domain: "Cloud Infrastructure",
    score: 68,
    trend: "down",
    status: "Warning",
  },
  {
    domain: "Endpoint Security",
    score: 74,
    trend: "stable",
    status: "Healthy",
  },
  { domain: "Supply Chain Risk", score: 45, trend: "down", status: "Critical" },
];

export const RAW_DATA: RawSecurityData = {
  totalIncidents: 65,
  topThreats: [
    "Credential Phishing",
    "Unpatched Cloud Assets",
    "API Misconfigurations",
  ],
  systemUptime: "99.98%",
  complianceStatus: "92% (SOC2 Alignment)",
};

export const INCIDENT_HIGHLIGHTS: IncidentHighlight[] = [
  {
    id: "INC-1202",
    title: "Unauthorized Identity Access Attempt",
    impact: "Moderate - Isolated to legacy tenant",
    date: "2 days ago",
    status: "Mitigated",
    summary:
      "A sophisticated phishing attempt was blocked by automated identity safeguards. No production data was accessed.",
  },
];
