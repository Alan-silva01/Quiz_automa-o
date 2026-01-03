
import { LeadData, WebhookPayload } from '../types';

const WEBHOOK_URL = 'https://autonomia-n8n-webhook.w8liji.easypanel.host/webhook/notificar-novolead';

export const sendLeadToWebhook = async (lead: LeadData): Promise<boolean> => {
  const timestamp = new Date().toISOString();

  // Constructing exactly the format requested by the user
  const payload = [
    {
      headers: {
        "host": "autonomia-n8n-webhook.w8liji.easypanel.host",
        "user-agent": "BotConversa-Partner-Webhook/1.0",
        "content-length": "330",
        "accept": "*/*",
        "accept-encoding": "gzip,br",
        "accept-language": "*",
        "content-type": "application/json",
        "x-forwarded-for": "15.228.201.163",
        "x-forwarded-host": "autonomia-n8n-webhook.w8liji.easypanel.host",
        "x-forwarded-port": "443",
        "x-forwarded-proto": "https",
        "x-forwarded-server": "7c5272ed28e3",
        "x-real-ip": "15.228.201.163",
        "x-webhook-event": "lead.distributed",
        "x-webhook-test": "true"
      },
      params: {},
      query: {},
      body: {
        event: "lead.distributed",
        lead: {
          ...lead,
          phone: lead.phone.startsWith('+') ? lead.phone : `+${lead.phone}`,
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
