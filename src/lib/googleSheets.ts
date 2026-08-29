import { google } from "googleapis";

const DEFAULT_SUBSCRIBER_SHEET = "Newsletter Subscribers";
const DEFAULT_CONTACT_SHEET = "Contact Form";

function getServiceAccountCredentials() {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
      };
    } catch {
      return null;
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  };
}

function getSheetsClient() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const credentials = getServiceAccountCredentials();

  if (!spreadsheetId || !credentials) {
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return {
    auth,
    spreadsheetId,
    sheets: google.sheets({ version: "v4", auth }),
  };
}

async function ensureSheetExists(spreadsheetId: string, name: string) {
  const client = getSheetsClient();

  if (!client) {
    return null;
  }

  const metadata = await client.sheets.spreadsheets.get({ spreadsheetId });
  const existing = metadata.data.sheets?.some((sheet) => sheet.properties?.title === name);

  if (!existing) {
    await client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: name,
              },
            },
          },
        ],
      },
    });
  }

  return client.sheets;
}

export async function appendToGoogleSheet(sheetName: string, row: Array<string | number | boolean | null>) {
  const client = getSheetsClient();

  if (!client) {
    return { ok: false, reason: "Google Sheets is not configured." };
  }

  const sheets = await ensureSheetExists(client.spreadsheetId, sheetName);

  if (!sheets) {
    return { ok: false, reason: "Google Sheets is not configured." };
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: client.spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row.map((value) => (value === null || value === undefined ? "" : String(value)))],
    },
  });

  return { ok: true };
}

export async function markSubscriberUnsubscribed(email: string) {
  const client = getSheetsClient();

  if (!client) {
    return { ok: false, reason: "Google Sheets is not configured." };
  }

  const sheetName = process.env.GOOGLE_SUBSCRIBERS_SHEET || DEFAULT_SUBSCRIBER_SHEET;
  const sheets = await ensureSheetExists(client.spreadsheetId, sheetName);

  if (!sheets) {
    return { ok: false, reason: "Google Sheets is not configured." };
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: client.spreadsheetId,
    range: `${sheetName}!A:F`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[1] === email);

  if (rowIndex === -1) {
    return { ok: false, reason: "Subscriber not found." };
  }

  const targetRow = rows[rowIndex];
  targetRow[2] = "unsubscribed";

  await sheets.spreadsheets.values.update({
    spreadsheetId: client.spreadsheetId,
    range: `${sheetName}!A${rowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [targetRow],
    },
  });

  return { ok: true };
}

export async function appendSubscriber(email: string, source = "website") {
  const sheetName = process.env.GOOGLE_SUBSCRIBERS_SHEET || DEFAULT_SUBSCRIBER_SHEET;
  const timestamp = new Date().toISOString();

  return appendToGoogleSheet(sheetName, [timestamp, email, "active", source]);
}

export async function appendContactForm(payload: {
  name: string;
  phone: string;
  email: string;
  message: string;
  interest: string;
}) {
  const sheetName = process.env.GOOGLE_CONTACT_SHEET || DEFAULT_CONTACT_SHEET;
  const timestamp = new Date().toISOString();

  return appendToGoogleSheet(sheetName, [
    timestamp,
    payload.name,
    payload.phone,
    payload.email,
    payload.message,
    payload.interest,
  ]);
}``
