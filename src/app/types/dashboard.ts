export const Severity = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

export const IncidentStatus = {
  NEW: "NEW",
  INVESTIGATING: "INVESTIGATING",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
} as const;
export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus];

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  analystId: string;
  openedAt: string;
  slaDeadline: string;
  category: string;
  summary: string;
}

export const AnalystStatus = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  AWAY: "AWAY",
} as const;
export type AnalystStatus = (typeof AnalystStatus)[keyof typeof AnalystStatus];

export interface Analyst {
  id: string;
  name: string;
  status: AnalystStatus;
  activeIncidents: number;
  avgResponseTime: string;
  role: string;
}

export type TimelineEventType =
  | "STATUS_CHANGE"
  | "ANALYST_ACTION"
  | "SYSTEM_ALERT"
  | "COMMENT";

export interface TimelineEvent {
  id: string;
  incidentId: string;
  type: TimelineEventType;
  timestamp: string;
  message: string;
  actor?: string;
}

export interface Entity {
  type: "User" | "Host" | "IP" | "File" | "Process";
  value: string;
}

export interface AlertTimelineEvent {
  timestamp: string;
  description: string;
  category: "System" | "Network" | "Identity" | "Process";
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  confidenceScore: number;
  description: string;
  entities: Entity[];
  timeline: AlertTimelineEvent[];
  rawDetails: Record<string, unknown>;
  status: "Open" | "In Progress" | "Escalated" | "Closed - Noise" | "Resolved";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RiskMetric {
  domain: string;
  score: number;
  trend: "up" | "down" | "stable";
  status: "Critical" | "Warning" | "Healthy";
}

export interface IncidentTrend {
  date: string;
  volume: number;
  severity: "High" | "Medium" | "Low";
}

export interface MTTRTrend {
  date: string;
  hours: number;
}

export interface ExecutiveSummary {
  headline: string;
  narrative: string;
  impactLevel: "High" | "Moderate" | "Low";
  strategicRecommendation: string;
}

export interface RawSecurityData {
  totalIncidents: number;
  topThreats: string[];
  systemUptime: string;
  complianceStatus: string;
}

export interface IncidentHighlight {
  id: string;
  title: string;
  impact: string;
  date: string;
  status: string;
  summary: string;
}
