
export enum SalesMode {
  INITIAL_OUTREACH = 'Initial Outreach',
  QUALIFICATION = 'Qualification',
  OBJECTION = 'Objection Handling',
  CLOSING = 'Closing',
  ENHANCE = 'Rep Draft Enhancement'
}

export enum Language {
  SYRIAN = 'Syrian',
  GULF = 'Gulf',
  FORMAL = 'Formal'
}

export enum AppTab {
  SALES = 'Sales Assistant',
  PROFILE = 'Company Profile',
  CUSTOMER = 'Customer Profile'
}

export interface Message {
  id: string;
  role: 'customer' | 'rep' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Suggestion {
  id: string;
  text: string;
  explanation: string;
}

export interface SalesContext {
  companyName: string;
  mission: string;
  services: string;
  pricingPolicy: string;
  targetAudience: string;
  buyingStage: string;
}

export interface CustomerContext {
  name: string;
  industry: string;
  painPoints: string;
  budget: string;
  notes: string;
}
