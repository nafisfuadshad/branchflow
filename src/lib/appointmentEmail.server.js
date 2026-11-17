// Builds the BranchFlow appointment confirmation email and sends it through the
// connected Gmail account, so it can reach any customer address (not just app users).

const BRAND = "#132521";
const PAGE = "#faf8f5";
const SURFACE = "#f5efe6";
const MUTED = "#5d6f6c";
const LOGO =
  "https://media.base44.com/images/public/6aebf22ee1bdc29147be8edf/64c9d0953_logo.png";
const APP_URL = "https://branch-flow-visit.base44.app";
const SUBJECT = "BranchFlow Student Project Confirmation";
const NOTICE =
  "This confirmation is for academic project demonstration purposes only. No real appointment has been scheduled with Wells Fargo. BranchFlow is a student prototype and is not affiliated with or endorsed by Wells Fargo.";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

const detailRow = (label, value, muted) =>
  `<tr><td style="padding:0 0 4px;font-size:11px;letter-spacing:1px;color:${MUTED};text-transform:uppercase;">${escapeHtml(label)}</td></tr>` +
  `<tr><td style="padding:0 0 ${muted ? 2 : 18}px;font-size:16px;font-weight:700;color:${muted ? MUTED : BRAND};">${escapeHtml(value)}</td></tr>`;

// The same content the BranchFlow confirmation has always shown.
export const buildConfirmationEmail = (data) => {
  const documents = data.documents.map(escapeHtml);

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:${PAGE};">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(
    `${data.name} · ${data.service} at ${data.branch} on ${data.date} at ${data.time}`
  )}</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${PAGE};font-family:Inter,Helvetica,Arial,sans-serif;color:${BRAND};">
      <tr><td style="background:${BRAND};padding:26px 40px;">
        <img src="${LOGO}" alt="BranchFlow" width="120" style="display:block;border:0;" />
        <div style="padding-top:12px;color:#ffffff;font-size:17px;font-weight:700;">BranchFlow</div>
      </td></tr>
      <tr><td style="padding:40px 40px 0;">
        <h1 style="margin:0;font-family:Fraunces,Georgia,serif;font-size:34px;line-height:1.15;font-weight:600;color:${BRAND};">BranchFlow Student Project Confirmation</h1>
        <p style="margin:14px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">
          Hi ${escapeHtml(data.name)}, your appointment is confirmed for this branch visit. Please arrive a few minutes early and bring the documents listed below.
        </p>
      </td></tr>
      <tr><td style="padding:26px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};border-radius:24px;">
          <tr><td style="padding:26px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${detailRow("Customer name", data.name)}
              ${detailRow("Service", data.service)}
              ${detailRow("Branch", data.branch)}
              ${detailRow("Branch address", data.branch_address, true)}
              ${detailRow("Date", data.date)}
              ${detailRow("Time", data.time)}
              ${detailRow("Estimated wait", data.wait)}
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 40px 0;">
        <div style="font-family:Fraunces,Georgia,serif;font-size:19px;font-weight:600;padding-bottom:6px;">What to bring</div>
        <div style="font-size:14px;line-height:1.7;color:${MUTED};">${documents.join("<br />")}</div>
      </td></tr>
      <tr><td style="padding:26px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};border-radius:24px;">
          <tr><td style="padding:20px 24px;font-size:12px;line-height:1.6;color:${MUTED};">${escapeHtml(
            NOTICE
          )}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 40px 32px;">
        <a href="${APP_URL}" style="display:inline-block;background:${BRAND};color:#ffffff;border-radius:24px;padding:14px 28px;font-size:14px;font-weight:700;text-decoration:none;">Back to BranchFlow</a>
      </td></tr>
      <tr><td style="background:${BRAND};padding:24px 40px;color:#ffffff;font-size:12px;line-height:1.6;">
        BranchFlow is a prototype. Every branch, wait time and appointment is fictional sample data.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = [
    "BranchFlow Student Project Confirmation",
    "",
    `Hi ${data.name}, your appointment is confirmed for this branch visit.`,
    "",
    `Customer name: ${data.name}`,
    `Service: ${data.service}`,
    `Branch: ${data.branch}`,
    `Branch address: ${data.branch_address}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Estimated wait: ${data.wait}`,
    "",
    "What to bring:",
    ...data.documents.map((document) => `- ${document}`),
    "",
    NOTICE,
    "",
    "BranchFlow is a prototype. Every branch, wait time and appointment is fictional sample data.",
    APP_URL,
  ].join("\n");

  return { subject: SUBJECT, html, text };
};

const toBase64 = (value) => Buffer.from(value, "utf8").toString("base64");
const wrap = (value) => value.replace(/(.{76})/g, "$1\r\n");
const toBase64Url = (value) =>
  toBase64(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const buildMime = ({ from, to, subject, html, text }) => {
  const boundary = `branchflow_${Date.now().toString(36)}`;
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrap(toBase64(text)),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrap(toBase64(html)),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
};

// Sends through the connected Gmail account and reports whether it actually went out.
export const sendViaGmail = async (base44, appointment) => {
  let accessToken;
  try {
    const connection = await base44.asServiceRole.connectors.getConnection("gmail");
    accessToken = connection?.accessToken;
  } catch {
    return { success: false, message: "Gmail is not connected." };
  }
  if (!accessToken) return { success: false, message: "Gmail is not connected." };

  const authHeader = { Authorization: `Bearer ${accessToken}` };

  const profile = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: authHeader,
  }).catch(() => null);
  const senderEmail = profile?.ok ? (await profile.json())?.emailAddress : null;
  if (!senderEmail) return { success: false, message: "Could not read the Gmail account." };

  const email = buildConfirmationEmail(appointment);
  const raw = buildMime({
    from: `"BranchFlow" <${senderEmail}>`,
    to: appointment.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: toBase64Url(raw) }),
  }).catch(() => null);

  if (!response?.ok) {
    return { success: false, message: `Gmail rejected the message (${response?.status ?? "network"}).` };
  }

  return { success: true, message: null };
};