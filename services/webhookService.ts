
import { LeadData, WebhookPayload } from '../types';

const WEBHOOK_URL = 'https://autonomia-n8n-webhook.w8liji.easypanel.host/webhook/notificar-novolead';

export const sendLeadToWebhook = async (lead: LeadData): Promise<boolean> => {
  const timestamp = new Date().toISOString();
  
  // Constructing exactly the format requested by the user
  const payload: WebhookPayload[] = [
    {
      headers: {
        "host": "autonomia-n8n-webhook.w8liji.easypanel.host",
        "user-agent": "BotConversa-Partner-Webhook/1.0",
        "content-type": "application/json",
        "x-webhook-event": "lead.distributed",
        "x-webhook-test": "false"
      },
      params: {},
      query: {},
      body: {
        event: "lead.distributed",
        lead: {
          ...lead,
          created_at: timestamp
        },
        timestamp: timestamp
      },
      webhookUrl: WEBHOOK_URL,
      executionMode: "production"
    }
  ];

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending lead to webhook:', error);
    return false;
  }
};
