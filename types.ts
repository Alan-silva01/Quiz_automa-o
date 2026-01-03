
export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  country: string;
  source: string;
  notes: string;
  revenue: number;
  created_at: string;
}

export interface WebhookPayload {
  headers: Record<string, string>;
  params: Record<string, any>;
  query: Record<string, any>;
  body: {
    event: string;
    lead: LeadData;
    timestamp: string;
  };
  webhookUrl: string;
  executionMode: string;
}
