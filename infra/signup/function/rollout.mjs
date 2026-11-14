// Run with operator credentials. Never print recipient addresses.
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { issue } from "./registration.mjs";
const db = new DynamoDBClient({}),
  target = process.env.DATA_TABLE,
  legacy = process.env.LEGACY_TABLE;
const mode = process.argv[2],
  apply = process.argv.includes("--apply");
if (
  !target ||
  !legacy ||
  target === legacy ||
  !["migrate", "invite"].includes(mode)
)
  throw Error(
    "Set distinct DATA_TABLE and LEGACY_TABLE and choose migrate or invite.",
  );
let cursor,
  processed = 0;
do {
  const page = await db.send(
    new ScanCommand({
      TableName: mode === "migrate" ? legacy : target,
      ExclusiveStartKey: cursor,
      ConsistentRead: true,
      FilterExpression: "#t=:t",
      ExpressionAttributeNames: { "#t": "topic" },
      ExpressionAttributeValues: { ":t": { S: "conference-2027" } },
    }),
  );
  for (const item of page.Items || []) {
    const email = item.email?.S;
    if (!email) continue;
    const Key = {
      pk: { S: "SUBSCRIBER#" + email },
      sk: { S: "conference-2027" },
    };
    if (mode === "migrate") {
      if (apply) {
        try {
          await db.send(
            new PutItemCommand({
              TableName: target,
              Item: { ...item, ...Key },
              ConditionExpression: "attribute_not_exists(pk)",
            }),
          );
        } catch (e) {
          if (e.name !== "ConditionalCheckFailedException") throw e;
        }
        const saved = await db.send(
          new GetItemCommand({ TableName: target, Key, ConsistentRead: true }),
        );
        if (
          saved.Item?.email?.S !== email ||
          saved.Item?.topic?.S !== item.topic.S
        )
          throw Error("Migration verification failed");
      }
    } else {
      if (item.invitedAt) continue;
      const auth = await db.send(
        new GetItemCommand({
          TableName: target,
          Key: { pk: { S: "EMAIL#" + email }, sk: { S: "AUTH" } },
          ConsistentRead: true,
        }),
      );
      if (auth.Item?.verified?.BOOL || auth.Item?.delivered?.BOOL) continue;
      if (apply) {
        if ((await issue(email)) === false) continue;
        await db.send(
          new UpdateItemCommand({
            TableName: target,
            Key,
            UpdateExpression: "SET invitedAt=:n",
            ExpressionAttributeValues: {
              ":n": { S: new Date().toISOString() },
            },
          }),
        );
      }
    }
    processed++;
  }
  cursor = page.LastEvaluatedKey;
} while (cursor);
console.log(mode, apply ? "processed" : "preview", processed);
