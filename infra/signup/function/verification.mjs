export function createVerifier({ project, siteKeys, getApiKey, fetchImpl = fetch }) {
  return async (token, origin) => {
    const hostname = new URL(origin).hostname;
    const siteKey = siteKeys[hostname];
    if (!siteKey || !project) throw new Error("Verification is not configured.");
    const result = await fetchImpl(`https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(project)}/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": await getApiKey() },
      body: JSON.stringify({ event: { token, siteKey, expectedAction: "conference_updates" } }),
      signal: AbortSignal.timeout(5000),
    });
    if (!result.ok) throw new Error("Verification service unavailable.");
    const assessment = await result.json();
    const properties = assessment.tokenProperties;
    return properties?.valid === true && properties.action === "conference_updates"
      && properties.hostname === hostname;
  };
}

export function validateInvite(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "chat.whatsapp.com" || url.port || url.username || url.password
    || !/^\/[a-zA-Z0-9]+$/.test(url.pathname) || url.search || url.hash) throw new Error("Invalid invite configuration.");
  return url.href;
}
