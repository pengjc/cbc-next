import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { enroll } from "./enrollment.mjs";
import { normalizeEmail } from "./subscription.mjs";
const table = process.env.DATA_TABLE;
if (!table) throw Error("Set DATA_TABLE to the deployment's ConferenceTable output.");
const client = new DynamoDBClient({});
let cursor, count = 0;
do {
  const page = await client.send(new ScanCommand({TableName:table,ExclusiveStartKey:cursor,
    FilterExpression:"sk = :auth AND verified = :yes",ProjectionExpression:"pk",
    ExpressionAttributeValues:{":auth":{S:"AUTH"},":yes":{BOOL:true}}}));
  for (const item of page.Items || []) {
    const email = normalizeEmail(item.pk.S.slice("EMAIL#".length));
    if (!item.pk.S.startsWith("EMAIL#") || !email) throw Error("Unexpected auth key.");
    await enroll(client,table,email);
    count++;
  }
  cursor=page.LastEvaluatedKey;
} while(cursor);
console.log("Verified accounts processed:", count);
