import test from "node:test";
import assert from "node:assert/strict";
import {DynamoDBClient} from "../infra/signup/function/node_modules/@aws-sdk/client-dynamodb/dist-cjs/index.js";
import {SESv2Client} from "../infra/signup/function/node_modules/@aws-sdk/client-sesv2/dist-cjs/index.js";
import {challenge,handler,issue} from "../infra/signup/function/registration.mjs";
test("issued email tokens supersede old links and support repeat visits for seven days, even in a new session",async t=>{
 const auth={}, urls=[];
 let now=Date.now();
 t.mock.method(Date,"now",()=>now);
 t.mock.method(SESv2Client.prototype,"send",async c=>{urls.push(new URL(c.input.Content.Simple.Body.Text.Data.split("\n")[1]));});
 t.mock.method(DynamoDBClient.prototype,"send",async c=>{
   if(c.constructor.name==="GetItemCommand")return {Item:auth};
   const values=c.input.ExpressionAttributeValues;
   if(values[":x"]){auth.digest=values[":h"];auth.expires=values[":x"];}
   else if(values[":n"]){if(auth.digest?.S!==values[":h"].S||+auth.expires.N<=now/1000)throw Object.assign(Error(),{name:"ConditionalCheckFailedException"});assert.equal(c.input.UpdateExpression,"SET verified=:v");auth.verified={BOOL:true};}
 });
 const email="family@example.com";
 const verify=async url=>(await challenge({triggerSource:"VerifyAuthChallengeResponse_Authentication",request:{userAttributes:{email},challengeAnswer:new URLSearchParams(url.hash.slice(1)).get("token")},response:{}})).response.answerCorrect;
 await issue(email);now+=61000;await issue(email);
 assert.equal(Number(auth.expires.N)-Math.floor(now/1000),604800);
 now+=6*86400000;assert.equal(await verify(urls[0]),false);assert.equal(await verify(urls[1]),true);assert.equal(await verify(urls[1]),true);
 now+=86400000;assert.equal(await verify(urls[1]),false);
 now+=61000;await issue(email);assert.equal(Number(auth.expires.N)-Math.floor(now/1000),604800);now+=7*86400000;assert.equal(await verify(urls[2]),false);
});
test("registration API requires a verified Cognito identity",async()=>{
 process.env.REGISTRATION_OPEN="true";
 const res=await handler({rawPath:"/registration/2027/me",requestContext:{http:{method:"GET"}}});
 assert.equal(res.statusCode,403);
});
test("public link requests require registration verification", async () => {
  process.env.REGISTRATION_OPEN="true";
  process.env.ALLOWED_ORIGINS="https://conference.example";
  for(const captchaToken of [undefined,"","x".repeat(12001)]){
    const result=await handler({rawPath:"/registration/link",headers:{origin:"https://conference.example"},requestContext:{http:{method:"POST"}},body:JSON.stringify({email:"family@example.com",captchaToken})});
    assert.equal(result.statusCode,403);
  }
});
test("verified enrollment preserves an existing subscription",async()=>{
  const {enroll}=await import("../infra/signup/function/enrollment.mjs");
  const rows=new Map();
  const client={send:async ({input})=>{
    assert.equal(input.ConditionExpression,"attribute_not_exists(pk)");
    const k=input.Item.pk.S;
    if(rows.has(k))throw Object.assign(Error(),{name:"ConditionalCheckFailedException"});
    rows.set(k,input.Item);
  }};
  await enroll(client,"staging","family@example.com");
  const saved=rows.get("SUBSCRIBER#family@example.com");
  await enroll(client,"staging","family@example.com");
  assert.equal(rows.size,1);
  assert.equal(rows.get("SUBSCRIBER#family@example.com"),saved);
  assert.equal(saved.topic.S,"conference-2027");
});
