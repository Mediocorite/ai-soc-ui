export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentStatus = "NEW" | "INVESTIGATING" | "ESCALATED" | "RESOLVED";
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
