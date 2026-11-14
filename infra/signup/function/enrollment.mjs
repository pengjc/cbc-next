import { PutItemCommand } from "@aws-sdk/client-dynamodb";
export async function enroll(client, table, email) {
  const topic = "conference-2027";
  try {
    await client.send(new PutItemCommand({
      TableName: table,
      Item: {pk:{S:"SUBSCRIBER#"+email},sk:{S:topic},email:{S:email},topic:{S:topic},createdAt:{S:new Date().toISOString()}},
      ConditionExpression:"attribute_not_exists(pk)"
    }));
  } catch (error) {
    if (error.name !== "ConditionalCheckFailedException") throw error;
  }
}
