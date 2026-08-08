export const VISITOR_INTENTS = [
  "Recruiter",
  "Client",
  "Collaborator",
  "Student",
  "General Visitor",
  "Out of Scope",
] as const;

export const OPPORTUNITY_TYPES = [
  "Employment",
  "Internship",
  "Freelance",
  "Partnership",
  "Collaboration",
  "None",
] as const;

export const INTEREST_AREAS = [
  "Agentic AI",
  "Web Engineering",
  "Brand Systems",
  "Patricians",
  "Career",
  "Motorsport",
  "MMA/BJJ",
  "Education",
] as const;

export const CONVERSATION_OUTCOMES = [
  "Opportunity",
  "Informational",
  "Knowledge Gap",
  "Out of Scope",
  "Abandoned",
] as const;

export type VisitorIntent = (typeof VISITOR_INTENTS)[number];
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];
export type InterestArea = (typeof INTEREST_AREAS)[number];
export type ConversationOutcome = (typeof CONVERSATION_OUTCOMES)[number];

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationAnalysis {
  visitorIntent: VisitorIntent;
  opportunityTypes: OpportunityType[];
  opportunityScore: number;
  qualifiedOpportunity: boolean;
  contactRecommended: boolean;
  interestAreas: InterestArea[];
  summary: string;
  outcome: ConversationOutcome;
  knowledgeGaps: string[];
  improvements: string[];
  tags: string[];
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number | null;
}

export interface ConversationLogEvent {
  sessionId: string;
  exchangeId: string;
  startedAt: string;
  completedAt: string;
  model: string;
  usage: TokenUsage;
  conversation: ConversationMessage[];
}

export interface ConversationLogRequest extends ConversationLogEvent {
  token: string;
}

export interface UsageTotals extends TokenUsage {
  model: string;
  durationSeconds: number;
  userMessages: number;
  assistantMessages: number;
}
