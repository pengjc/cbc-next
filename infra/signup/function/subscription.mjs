export function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || /[^\x21-\x7e]/.test(email)) return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
    || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  if (labels.at(-1).length < 2) return null;
  return email;
}

// Verify one token, then perform either or both requested actions.
export function createHandler({ save, verify, getInvite, allowedOrigins, now = () => new Date().toISOString(), log = console.error }) {
  const response = (statusCode, code, extra = {}) => ({
    statusCode,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({ code, ...extra }),
  });
  return async event => {
    if (event.requestContext?.http?.method !== "POST") return response(405, "method_not_allowed");
    const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
    if (!allowedOrigins.includes(headers.origin)) return response(403, "origin_not_allowed");
    if (!/^application\/json(?:\s*;|$)/i.test(headers["content-type"] ?? "")) return response(415, "json_required");
    if (typeof event.body !== "string" || event.body.length > 24000) return response(413, "request_too_large");
    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    if (Buffer.byteLength(body, "utf8") > 16384) return response(413, "request_too_large");
    let data;
    try { data = JSON.parse(body); } catch { return response(400, "invalid_request"); }
    if (!data || Array.isArray(data) || typeof data.subscribeEmail !== "boolean" || typeof data.joinWhatsapp !== "boolean"
      || (!data.subscribeEmail && !data.joinWhatsapp)) return response(400, "choose_an_option");
    const email = data.subscribeEmail ? normalizeEmail(data.email) : null;
    if (data.subscribeEmail && !email) return response(400, "invalid_email");
    if (typeof data.captchaToken !== "string" || !data.captchaToken.trim() || data.captchaToken.length > 12000) return response(403, "verification_required");
    try {
      if (!await verify(data.captchaToken, headers.origin)) return response(403, "verification_failed");
      // Resolve all requested configuration before writing, so a missing invite doesn't save a partial request.
      const inviteUrl = data.joinWhatsapp ? await getInvite() : undefined;
      if (data.subscribeEmail) {
        try { await save({ email, createdAt: now(), topic: "conference-2027" }); }
        catch (error) { if (error?.name !== "ConditionalCheckFailedException") throw error; }
      }
      return response(200, "success", { emailSubscribed: data.subscribeEmail, ...(inviteUrl ? { inviteUrl } : {}) });
    } catch {
      log("updates_request_failed");
      return response(503, "temporarily_unavailable");
    }
  };
}
