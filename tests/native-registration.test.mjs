import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { form, applyChanges, changes, paths } from "../infra/signup/function/record.mjs";
import { handler } from "../infra/signup/function/registration.mjs";
import { DynamoDBClient } from "../infra/signup/function/node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js";
import { SESv2Client } from "../infra/signup/function/node_modules/@aws-sdk/client-sesv2/dist-cjs/index.js";
import { marshall } from "../infra/signup/function/node_modules/@aws-sdk/util-dynamodb/dist-cjs/index.js";

test("editing one sibling writes one native path and preserves sibling order", () => {
  const ids = [randomUUID(), randomUUID()];
  const draft = {children: ids.map((id, i) => ({id, first: "Child " + i, age:"5"})), rooms:[]};
  const old = applyChanges(null, changes(form(), draft));
  const edited = structuredClone(draft);
  edited.children[1].first = "Edited";
  const next = applyChanges(old, changes(form(old), edited));
  assert.deepEqual(paths(old, next), [[["children", ids[1], "first"], "Edited"]]);
  assert.deepEqual(next.childrenOrder, ids);
  assert.equal(next.children[ids[0]].age, 5);
  assert.deepEqual(changes(form(next), edited), []);
});

test("only first completion sends a receipt, including after release and reclaim", async t => {
  process.env.REGISTRATION_OPEN = "true";
  let stored, mail = 0, writes = 0;
  t.mock.method(SESv2Client.prototype, "send", async () => {mail++});
  t.mock.method(DynamoDBClient.prototype, "send", async cmd => {
    if (cmd.constructor.name === "GetItemCommand") return {Item:stored && marshall(stored)};
    writes++;
    return {};
  });
  const id = randomUUID();
  const draft = {name:"Test", locality:"Charlotte", adults:"1", youth:"0", kids:"0", children:[],
    rooms:[{id,guest:"Test",number:"0001",arrival:"2027-01-15",departure:"2027-01-17"}]};
  async function patch(ops) {
    const res = await handler({rawPath:"/registration/2027/me",requestContext:{http:{method:"PATCH"},
      authorizer:{jwt:{claims:{sub:"test",email:"test@example.com",token_use:"id",email_verified:true}}}},
      body:JSON.stringify({version:stored?.version || 0, changes:ops})});
    assert.equal(res.statusCode, 200);
    const data=JSON.parse(res.body);
    stored={...applyChanges(stored,ops),version:data.version,status:data.status};
    if (data.status==="complete") stored.firstCompletedAt ??= "initial";
    return data.status;
  }
  assert.equal(await patch(changes(form(),draft)), "complete");
  const number=value=>[{group:"rooms",id,field:"number",value}];
  await patch(number("0001"));
  assert.equal(writes,1);
  assert.equal(await patch(number("")), "draft");
  assert.equal(await patch(number("0001")), "complete");
  assert.equal(mail,1);
});
