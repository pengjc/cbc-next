import test from "node:test";
import assert from "node:assert/strict";
import { createHandler, normalizeEmail } from "../infra/signup/function/subscription.mjs";

const origin = "https://carolinasblendingconference.org";
const event = (email, overrides = {}) => ({
  requestContext: { http: { method: "POST" } },
  headers: { origin, "content-type": "application/json" },
  body: JSON.stringify({ email, subscribeEmail: true, joinWhatsapp: false, captchaToken: "valid-token" }), ...overrides,
});
const handler = (save, options = {}) => createHandler({ save, verify: async () => true, getInvite: async () => "https://chat.whatsapp.com/ExampleInvite", allowedOrigins: [origin], ...options });

test("normalizes addresses while preserving plus tags", () => {
  assert.equal(normalizeEmail("  Saint+Updates@Example.COM  "), "saint+updates@example.com");
  for (const value of [null, 42, "", "no-at-sign", "a@@example.com", "a@localhost", "a b@example.com", "a\nb@example.com", "a@example.com,b@example.com", "a;@example.com", ".a@example.com", "a..b@example.com", "a@-example.com", "a@ex_ample.com", `${"a".repeat(65)}@example.com`]) {
    assert.equal(normalizeEmail(value), null, String(value));
  }
});

test("saves only normalized email, timestamp and fixed conference topic", async () => {
  let saved;
  const response = await handler(async item => { saved = item; }, { now: () => "2026-11-13T00:00:00Z" })(event(" A+B@Example.com "));
  assert.equal(response.statusCode, 200);
  assert.deepEqual(saved, { email: "a+b@example.com", createdAt: "2026-11-13T00:00:00Z", topic: "conference-2027" });
});

test("rejects malformed inputs without calling storage", async () => {
  const run = handler(() => { assert.fail("must not save"); });
  for (const body of ["null", "[]", "{}", "broken", '{"email":false}', '{"email":"bad"}']) {
    assert.equal((await run(event("", { body }))).statusCode, 400);
  }
  assert.equal((await run(event("a@example.com", { body: "x".repeat(16385) }))).statusCode, 413);
  assert.equal((await run(event("a@example.com", { headers: { origin, "content-type": "text/plain" } }))).statusCode, 415);
  assert.equal((await run(event("a@example.com", { headers: { origin: "https://other.example", "content-type": "application/json" } }))).statusCode, 403);
  assert.equal((await run(event("a@example.com", { headers: {} }))).statusCode, 403);
  assert.equal((await run(event("a@example.com", { requestContext: { http: { method: "GET" } } }))).statusCode, 405);
});

test("accepts API Gateway base64 bodies and case-insensitive headers", async () => {
  const result = await handler(async () => {})(event("", {
    headers: { Origin: origin, "Content-Type": "application/json; charset=utf-8" },
    body: Buffer.from(JSON.stringify({ email: "a@example.com", subscribeEmail: true, joinWhatsapp: false, captchaToken: "valid-token" })).toString("base64"), isBase64Encoded: true,
  }));
  assert.equal(result.statusCode, 200);
});

test("new, duplicate and simultaneous requests have identical responses", async () => {
  const records = new Map();
  const run = handler(async item => {
    if (records.has(item.email)) throw Object.assign(new Error("duplicate"), { name: "ConditionalCheckFailedException" });
    records.set(item.email, item);
  });
  const results = await Promise.all(Array.from({ length: 10 }, () => run(event("Same@Example.com"))));
  assert.equal(records.size, 1);
  for (const result of results) assert.deepEqual(result, results[0]);
  assert.deepEqual(await run(event("same@example.com")), results[0]);
});

test("database failures return a retry response and do not log personal data", async () => {
  const logs = [];
  const response = await handler(async () => { throw new Error("failure a@example.com"); }, { log: (...args) => logs.push(args) })(event("a@example.com"));
  assert.equal(response.statusCode, 503);
  assert.deepEqual(logs, [["updates_request_failed"]]);
  assert.ok(!response.body.includes("a@example.com"));
});
