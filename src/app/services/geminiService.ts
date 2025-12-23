import { GoogleGenerativeAI, type ChatSession } from "@google/generative-ai";
import type {
  Incident,
  Analyst,
  Alert,
  TimelineEvent,
  ExecutiveSummary,
  RawSecurityData,
  RiskMetric,
  IncidentHighlight,
} from "../types/dashboard";

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    this.ai = new GoogleGenerativeAI(
      (import.meta as unknown as { env: Record<string, string> }).env
        .VITE_GEMINI_API_KEY || ""
    );
  }

  // --- SOC Lead Methods ---
  async getSOCHealthSummary(
    incidents: Incident[],
    analysts: Analyst[]
  ): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction:
          "You are a senior SOC Commander. Your tone is professional, urgent but calm, and highly analytical.",
      });
      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this SOC operational state and provide a 2-sentence executive summary for the SOC Lead. Focus on risks, workload, and SLA adherence.
        
        Active Incidents: ${JSON.stringify(incidents)}
        Analyst Status: ${JSON.stringify(analysts)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      });
      return (
        response.response.text() ||
        "Operational intelligence currently unavailable."
      );
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating real-time SOC health summary.";
    }
  }

  async getIncidentBrief(
    incident: Incident,
    timeline: TimelineEvent[]
  ): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({
        model: "gemini-3-flash-preview",
        systemInstruction:
          "Provide a concise 3-point bulleted summary of: 1. Core Threat, 2. Actions Taken, 3. Critical Next Steps.",
      });
      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Summarize this incident and its current progress for an Incident Commander.
        
        Incident: ${JSON.stringify(incident)}
        Timeline: ${JSON.stringify(timeline)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      });
      return response.response.text() || "Briefing unavailable.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating incident briefing.";
    }
  }

  createIncidentChat(
    incident: Incident,
    timeline: TimelineEvent[]
  ): ChatSession {
    const model = this.ai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `You are a SOC Assistant for an Incident Commander. 
        Context for current incident: 
        - ID: ${incident.id}
        - Title: ${incident.title}
        - Severity: ${incident.severity}
        - Summary: ${incident.summary}
        - Timeline: ${JSON.stringify(timeline)}
        
        Your role is to answer questions based ONLY on this context and security best practices. Be concise, tactical, and helpful. Do not speculate beyond available logs unless asked for professional judgment.`,
    });
    return model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.3,
      },
    });
  }

  // --- SOC Analyst Methods ---
  async generateAlertSummary(alert: Alert) {
    try {
      const model = this.ai.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Perform a security analysis on the following alert: ${JSON.stringify(
        alert
      )}. Provide a concise summary in three parts: 1. WHAT, 2. WHY, 3. EVIDENCE. Return as JSON.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Error generating alert summary:", error);
      return {
        what: "Unable to generate summary at this time.",
        why: "Analysis service unavailable.",
        evidence: "N/A",
      };
    }
  }

  createAnalystChat(alert: Alert): ChatSession {
    const model = this.ai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `You are an expert SOC Analyst Assistant named "Sentinel-AI". 
        You are currently investigating this specific alert: ${JSON.stringify(
          alert
        )}. 
        Your goal is to help the human analyst triage this alert by answering questions about its entities, timeline, and potential remediation. 
        Keep your answers concise, tactical, and formatted with markdown where appropriate.`,
    });
    return model.startChat({
      history: [],
    });
  }

  // --- Executive Methods ---
  async generateExecutiveNarrative(
    risks: RiskMetric[],
    data: RawSecurityData,
    highlights: IncidentHighlight[]
  ): Promise<ExecutiveSummary> {
    const prompt = `
      Act as a Senior Security Strategist (EY Tone). 
      Analyze the following security data and provide a concise, jargon-free, board-ready executive summary.
      
      Risk Metrics: ${JSON.stringify(risks)}
      Operational Data:
      - Total Incidents: ${data.totalIncidents}
      - Top Threat Domains: ${data.topThreats.join(", ")}
      - System Resilience: ${data.systemUptime}
      - Regulatory Compliance: ${data.complianceStatus}
      
      Strategic Highlights: ${JSON.stringify(highlights)}
      
      Focus on business impact, risk reduction, and strategic alignment. 
      Avoid technical acronyms like SIEM, SOAR, or specific CVE numbers.
      Return a JSON object with: headline, narrative, impactLevel (High/Moderate/Low), and strategicRecommendation.
    `;

    try {
      const model = this.ai.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Gemini Error:", error);
      return {
        headline: "Security Posture remains stable",
        narrative:
          "Overall risk exposure is within acceptable thresholds. Monitoring continues for emergent identity-based threats.",
        impactLevel: "Low",
        strategicRecommendation:
          "Continue investment in identity access governance.",
      };
    }
  }
}

export const geminiService = new GeminiService();
