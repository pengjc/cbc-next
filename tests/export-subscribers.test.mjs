import test from "node:test";
import assert from "node:assert/strict";
import { collectSubscribers, formatSubscribers } from "../scripts/export-subscribers.mjs";

const item = (email, topic = "conference-2027") => ({ email: { S: email }, topic: { S: topic } });
test("exports all pages, including empty pages with cursors, and deduplicates", async () => {
  const cursor1 = { email: { S: "cursor1" } };
  const cursor2 = { email: { S: "cursor2" } };
  const pages = [
    { Items: [item("B@Example.com"), item("a@example.com")], LastEvaluatedKey: cursor1 },
    { Items: [], LastEvaluatedKey: cursor2 },
    { Items: [item("b@example.com"), item("c@example.com"), item("bad"), item("other@example.com", "other")], LastEvaluatedKey: {} },
  ];
  const cursors = [];
  const result = await collectSubscribers(async cursor => { cursors.push(cursor); return pages.shift(); });
  assert.deepEqual(cursors, [undefined, cursor1, cursor2]);
  assert.deepEqual(result, ["a@example.com", "b@example.com", "c@example.com"]);
});
test("formats recipient files and handles an empty list", () => {
  assert.equal(formatSubscribers(["a@example.com", "b@example.com"], "txt"), "a@example.com\nb@example.com\n");
  assert.equal(formatSubscribers(["a@example.com"], "csv"), 'email\n"a@example.com"\n');
  assert.equal(formatSubscribers([], "txt"), "");
  assert.equal(formatSubscribers([], "csv"), "email\n");
  assert.throws(() => formatSubscribers([], "json"));
});
test("storage failure rejects the export instead of producing a partial list", async () => {
  await assert.rejects(collectSubscribers(async () => { throw new Error("scan failed"); }), /scan failed/);
});
