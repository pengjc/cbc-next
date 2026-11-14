import {parameter} from "./parameter.mjs";
import {createVerifier,validateInvite} from "./verification.mjs";
import {enroll} from "./enrollment.mjs";
const verify = createVerifier({project:process.env.RECAPTCHA_PROJECT,siteKeys:{...JSON.parse(process.env.RECAPTCHA_SITE_KEYS || "{}"),"dytw413fchjuk.cloudfront.net":process.env.RECAPTCHA_STAGING_SITE_KEY},action:"conference_registration",getApiKey:()=>parameter(process.env.RECAPTCHA_API_KEY_PARAMETER)});
import { randomBytes, createHash } from "node:crypto";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  TransactWriteItemsCommand,
} from "@aws-sdk/client-dynamodb";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { normalizeEmail } from "./subscription.mjs";
import { missing, roomKey } from "./family.mjs";
const db = new DynamoDBClient({}),
  cognito = new CognitoIdentityProviderClient({}),
  ses = new SESv2Client({});
const TableName = process.env.DATA_TABLE,
  pool = process.env.POOL_ID,
  client = process.env.APP_CLIENT;
const S = (S) => ({ S }),
  N = (n) => ({ N: String(n) }),
  key = (pk, sk) => ({ pk: S(pk), sk: S(sk) });
const hash = (v) => createHash("sha256").update(v).digest("hex");
const get = async (Key) =>
  (await db.send(new GetItemCommand({ TableName, Key, ConsistentRead: true })))
    .Item;
const origin = process.env.REGISTRATION_ORIGIN || "https://carolinasblendingconference.org";
const linkLifetimeSeconds = 7 * 24 * 60 * 60;
async function mail(email, subject, label, url, note = "") {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: "info@carolinasblendingconference.org",
      Destination: { ToAddresses: [email] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: label + "\n" + url + (note ? "\n\n" + note : "") },
            Html: {
              Data:
                '<p>Carolinas Blending Conference 2027</p><p><a href="' +
                url +
                '">' +
                label +
                "</a></p>" + (note ? "<p>" + note + "</p>" : ""),
            },
          },
        },
      },
    }),
  );
}
export async function issue(email) {
  const Key = key("EMAIL#" + email, "AUTH"),
    now = Math.floor(Date.now() / 1000),
    token = randomBytes(32).toString("hex");
  const old = await get(Key),
    first = !old?.verified?.BOOL;
  try {
    await db.send(
      new UpdateItemCommand({
        TableName,
        Key,
        UpdateExpression: "SET digest=:h, expires=:x, issued=:n",
        ConditionExpression: "attribute_not_exists(issued) OR issued < :limit",
        ExpressionAttributeValues: {
          ":h": S(hash(token)),
          ":x": N(now + linkLifetimeSeconds),
          ":n": N(now),
          ":limit": N(now - 60),
        },
      }),
    );
  } catch (e) {
    if (e.name === "ConditionalCheckFailedException") return false;
    throw e;
  }
  const label = first
    ? "Confirm my email and start registration"
    : "Edit my registration";
  try {
    await mail(
      email,
      label,
      label,
      origin + "/register#" + new URLSearchParams({ email, token }).toString(),
      "This link works once within seven days. If you request another link, use the newest email.",
    );
  } catch (e) {
    await db.send(
      new UpdateItemCommand({
        TableName,
        Key,
        ConditionExpression: "digest=:h",
        UpdateExpression: "REMOVE issued, digest",
        ExpressionAttributeValues: { ":h": S(hash(token)) },
      }),
    );
    throw e;
  }
  await db.send(
    new UpdateItemCommand({
      TableName,
      Key,
      UpdateExpression: "SET delivered=:v",
      ExpressionAttributeValues: { ":v": { BOOL: true } },
    }),
  );
}
export async function challenge(e) {
  const phase = e.triggerSource;
  if (phase === "DefineAuthChallenge_Authentication") {
    const last = e.request.session.at(-1);
    e.response.issueTokens = last?.challengeResult === true;
    e.response.failAuthentication = !!last && !e.response.issueTokens;
    if (!last) e.response.challengeName = "CUSTOM_CHALLENGE";
  }
  if (phase === "CreateAuthChallenge_Authentication") {
    e.response.privateChallengeParameters = { kind: "email-link" };
    e.response.publicChallengeParameters = {};
  }
  if (phase === "VerifyAuthChallengeResponse_Authentication") {
    e.response.answerCorrect = false;
    try {
      await db.send(
        new UpdateItemCommand({
          TableName,
          Key: key("EMAIL#" + e.request.userAttributes.email, "AUTH"),
          UpdateExpression: "SET verified=:v REMOVE digest",
          ConditionExpression: "digest=:h AND expires>:n",
          ExpressionAttributeValues: {
            ":h": S(hash(e.request.challengeAnswer)),
            ":n": N(Math.floor(Date.now() / 1000)),
            ":v": { BOOL: true },
          },
        }),
      );
      e.response.answerCorrect = true;
    } catch (err) {
      if (err.name !== "ConditionalCheckFailedException") throw err;
    }
  }
  return e;
}
const reply = (statusCode, data) => ({
  statusCode,
  headers: { "cache-control": "no-store", "content-type": "application/json" },
  body: JSON.stringify(data),
});
export async function handler(e) {
  try {
    if (process.env.REGISTRATION_OPEN !== "true")
      return reply(503, { error: "Registration has not opened." });
    const method = e.requestContext.http.method,
      path = e.rawPath;
    if ((e.body || "").length > 150000) return reply(413, {});
    let b = {};
    try {
      b = JSON.parse(e.body || "{}");
    } catch {
      return reply(400, {});
    }
    if (path.endsWith("/link") || path.endsWith("/redeem")) {
      const email = normalizeEmail(b.email);
      if (!email) return reply(400, {});
      if (path.endsWith("/link")) {
        const requestOrigin=e.headers?.origin || e.headers?.Origin;
        if(!requestOrigin || !(process.env.ALLOWED_ORIGINS || "").split(",").includes(requestOrigin) ||
           typeof b.captchaToken!=="string" || !b.captchaToken.trim() || b.captchaToken.length>12000 ||
           !await verify(b.captchaToken,requestOrigin)) return reply(403,{error:"Please complete verification again."});
        await issue(email);
        return reply(202, {});
      }
      if (!/^[a-f0-9]{64}$/.test(b.token)) return reply(403, {});
      const auth = await get(key("EMAIL#" + email, "AUTH"));
      if (
        auth?.digest?.S !== hash(b.token) ||
        +auth.expires.N <= Date.now() / 1000
      )
        return reply(403, {});
      try {
        await cognito.send(
          new AdminCreateUserCommand({
            UserPoolId: pool,
            Username: email,
            UserAttributes: [
              { Name: "email", Value: email },
              { Name: "email_verified", Value: "true" },
            ],
            MessageAction: "SUPPRESS",
          }),
        );
      } catch (err) {
        if (err.name !== "UsernameExistsException") throw err;
      }
      const args = { ClientId: client, UserPoolId: pool };
      const init = await cognito.send(
        new AdminInitiateAuthCommand({
          ...args,
          AuthFlow: "CUSTOM_AUTH",
          AuthParameters: { USERNAME: email },
        }),
      );
      const result = await cognito.send(
        new AdminRespondToAuthChallengeCommand({
          ...args,
          Session: init.Session,
          ChallengeName: "CUSTOM_CHALLENGE",
          ChallengeResponses: {
            USERNAME: init.ChallengeParameters?.USERNAME || email,
            ANSWER: b.token,
          },
        }),
      );
      if(result.AuthenticationResult) await enroll(db, TableName, email);
      return result.AuthenticationResult
        ? reply(200, { token: result.AuthenticationResult.IdToken })
        : reply(403, {});
    }
    const claims = e.requestContext.authorizer?.jwt?.claims;
    if (
      !claims?.sub ||
      claims.token_use !== "id" ||
      String(claims.email_verified) !== "true"
    )
      return reply(403, {});
    if(path.endsWith("/whatsapp")) return reply(200,{inviteUrl:validateInvite(await parameter(process.env.WHATSAPP_INVITE_PARAMETER))});
    const Key = key("FAMILY#" + claims.sub, "YEAR#2027"),
      old = await get(Key);
    const previous = JSON.parse(old?.family?.S || "null"),
      version = Number(old?.version?.N || 0);
    if (method === "GET")
      return reply(200, {
        family: previous,
        version,
        status: old?.status?.S || "draft",
        email: claims.email,
      });
    const f = b.family;
    if (
      !f ||
      !Array.isArray(f.children) ||
      !Array.isArray(f.rooms) ||
      f.rooms.length > 30 ||
      !Number.isInteger(b.version) ||
      typeof b.complete !== "boolean"
    )
      return reply(400, {});
    const flat = (o) =>
      o &&
      typeof o === "object" &&
      !Array.isArray(o) &&
      Object.values(o).every((v) => typeof v === "string" && v.length <= 4000);
    const { children, rooms, ...household } = f;
    if (
      !flat(household) ||
      !rooms.every((r) => flat(r) && r.id) ||
      !children.every((c) => {
        if (!c || typeof c !== "object") return false;
        const { meetings, ...fields } = c;
        return (
          flat(fields) &&
          c.id &&
          Array.isArray(meetings) &&
          meetings.every((v) => typeof v === "string")
        );
      })
    )
      return reply(400, {});
    if (b.version !== version)
      return reply(409, {
        error: "This registration changed. Reload before editing.",
      });
    const errors = missing(f);
    if (b.complete && errors.length) return reply(422, { errors });
    const status =
      !errors.length && (b.complete || old?.status?.S === "complete")
        ? "complete"
        : "draft";
    const numbers = (rooms) =>
      rooms.map((r) => roomKey(r.number || "")).filter(Boolean);
    const before = numbers(previous?.rooms || []),
      after = numbers(f.rooms);
    if (new Set(after).size !== after.length)
      return reply(422, { errors: ["Each room number must be unique."] });
    const stamp = new Date().toISOString(),
      claim = (n) => key("HILTON#2027", "NUMBER#" + hash(n));
    const tx = [
      {
        Put: {
          TableName,
          Item: {
            ...Key,
            family: S(JSON.stringify(f)),
            email: S(claims.email),
            version: N(version + 1),
            status: S(status),
            createdAt: old?.createdAt || S(stamp),
            updatedAt: S(stamp),
            hotelSource: S("reported_by_family"),
          },
          ConditionExpression: version
            ? "version=:v"
            : "attribute_not_exists(pk)",
          ...(version
            ? { ExpressionAttributeValues: { ":v": N(version) } }
            : {}),
        },
      },
    ];
    for (const n of after.filter((n) => !before.includes(n)))
      tx.push({
        Put: {
          TableName,
          Item: { ...claim(n), owner: S(claims.sub) },
          ConditionExpression: "attribute_not_exists(pk)",
        },
      });
    for (const n of before.filter((n) => !after.includes(n)))
      tx.push({
        Delete: {
          TableName,
          Key: claim(n),
          ConditionExpression: "owner=:s",
          ExpressionAttributeValues: { ":s": S(claims.sub) },
        },
      });
    await db.send(new TransactWriteItemsCommand({ TransactItems: tx }));
    let receipt = true;
    if (status === "complete" && old?.status?.S !== "complete") {
      try {
        await mail(
          claims.email,
          "Conference registration complete",
          "Manage my registration",
          origin + "/register",
        );
      } catch {
        receipt = false;
      }
    }
    return reply(200, { version: version + 1, status, receipt });
  } catch (err) {
    if (err.name === "TransactionCanceledException")
      return reply(409, {
        error:
          "Registration changed or a Hilton number is already claimed. Your edits are still on this page.",
      });
    if (err.name === "NotAuthorizedException") return reply(403, {});
    return reply(503, {});
  }
}
