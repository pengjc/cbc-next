import test from "node:test";
import assert from "node:assert/strict";
import { createVerifier, validateInvite } from "../infra/signup/function/verification.mjs";
import { createHandler } from "../infra/signup/function/subscription.mjs";

const origin = "https://conference.example.com";
const invite = "https://chat.whatsapp.com/ExampleInvite";
const event = data => ({ requestContext: { http: { method: "POST" } }, headers: { origin, "content-type": "application/json" }, body: JSON.stringify(data) });
const options = { subscribeEmail: true, joinWhatsapp: true, email: "a@example.com", captchaToken: "token" };

test("one assessment handles either or both choices, without unwanted email storage", async () => {
  for (const [email, whatsapp] of [[true, true], [true, false], [false, true]]) {
    let assessed = 0; let saved = 0; let invites = 0;
    const handler = createHandler({ allowedOrigins: [origin], verify: async () => { assessed++; return true; }, save: async () => { saved++; }, getInvite: async () => { invites++; return invite; } });
    const result = await handler(event({ ...options, email: email ? options.email : undefined, subscribeEmail: email, joinWhatsapp: whatsapp }));
    assert.equal(result.statusCode, 200);
    assert.equal(assessed, 1); assert.equal(saved, Number(email)); assert.equal(invites, Number(whatsapp));
    const data = JSON.parse(result.body);
    assert.equal(data.emailSubscribed, email);
    assert.equal(data.inviteUrl, whatsapp ? invite : undefined);
    assert.equal(result.headers["Cache-Control"], "no-store");
  }
});

test("invalid or missing verification never writes or reveals the invitation", async () => {
  const handler = createHandler({ allowedOrigins: [origin], verify: async () => false, save: () => assert.fail(), getInvite: () => assert.fail() });
  for (const token of [undefined, "", "invalid", "x".repeat(12001)]) {
    const result = await handler(event({ ...options, captchaToken: token }));
    assert.equal(result.statusCode, 403); assert.ok(!result.body.includes(invite));
  }
});

test("nothing selected and invalid email are rejected before assessment", async () => {
  const handler = createHandler({ allowedOrigins: [origin], verify: () => assert.fail(), save: () => assert.fail() });
  assert.equal((await handler(event({ ...options, subscribeEmail: false, joinWhatsapp: false }))).statusCode, 400);
  assert.equal((await handler(event({ ...options, email: "invalid" }))).statusCode, 400);
});

test("outages, quota exhaustion and missing invite configuration fail closed", async () => {
  for (const stage of ["verify", "invite"]) {
    const handler = createHandler({ allowedOrigins: [origin], verify: async () => { if (stage === "verify") throw new Error("quota"); return true; }, getInvite: async () => { throw new Error("missing parameter"); }, save: () => assert.fail(), log: () => {} });
    const response = await handler(event(options));
    assert.equal(response.statusCode, 503); assert.ok(!response.body.includes(invite));
  }
});

test("verifier checks Google validity, action, hostname, and server-selected key", async () => {
  for (const [properties, expected] of [
    [{ valid: true, action: "conference_updates", hostname: "conference.example.com" }, true],
    [{ valid: false, invalidReason: "EXPIRED" }, false],
    [{ valid: false, invalidReason: "DUPE" }, false],
    [{ valid: true, action: "other", hostname: "conference.example.com" }, false],
    [{ valid: true, action: "conference_updates", hostname: "attacker.example.com" }, false],
    [undefined, false],
  ]) {
    const verifier = createVerifier({ project: "test-project", siteKeys: { "conference.example.com": "configured-key" }, getApiKey: async () => "secret", fetchImpl: async (url, request) => {
      assert.ok(url.endsWith("/test-project/assessments"));
      assert.ok(!url.includes("secret"));
      assert.equal(request.headers["X-Goog-Api-Key"], "secret");
      assert.deepEqual(JSON.parse(request.body), { event: { token: "token", siteKey: "configured-key", expectedAction: "conference_updates" } });
      return { ok: true, json: async () => ({ tokenProperties: properties }) };
    } });
    assert.equal(await verifier("token", origin), expected);
    await assert.rejects(verifier("token", "https://unknown.example"));
  }
  const verifier = createVerifier({ project: "p", siteKeys: { "conference.example.com": "k" }, getApiKey: async () => "s", fetchImpl: async () => ({ ok: false, status: 429 }) });
  await assert.rejects(verifier("token", origin));
});

test("invite configuration allows only WhatsApp HTTPS group links", () => {
  assert.equal(validateInvite(invite), invite);
  for (const bad of ["http://chat.whatsapp.com/a", "https://evil.example/a", "https://chat.whatsapp.com.evil.example/a", "https://user:pass@chat.whatsapp.com/a", "https://chat.whatsapp.com/", "https://chat.whatsapp.com/a?next=x"]) assert.throws(() => validateInvite(bad));
});
