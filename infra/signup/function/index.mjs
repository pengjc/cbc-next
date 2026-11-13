import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { createHandler } from "./subscription.mjs";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { createVerifier, validateInvite } from "./verification.mjs";

const client = new DynamoDBClient({});
const ssm = new SSMClient({});
const parameters = new Map();
async function parameter(name) {
  const cached = parameters.get(name);
  if (cached && cached.expires > Date.now()) return cached.value;
  const result = await ssm.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
  const value = result.Parameter?.Value;
  if (!value) throw new Error("Missing configuration.");
  parameters.set(name, { value, expires: Date.now() + 300000 });
  return value;
}
export const handler = createHandler({
  verify: createVerifier({
    project: process.env.RECAPTCHA_PROJECT,
    siteKeys: JSON.parse(process.env.RECAPTCHA_SITE_KEYS ?? "{}"),
    getApiKey: () => parameter(process.env.RECAPTCHA_API_KEY_PARAMETER),
  }),
  getInvite: async () => validateInvite(await parameter(process.env.WHATSAPP_INVITE_PARAMETER)),
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "").split(",").map(origin => origin.trim()),
  save: ({ email, createdAt, topic }) => client.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: { email: { S: email }, createdAt: { S: createdAt }, topic: { S: topic } },
    ConditionExpression: "attribute_not_exists(email)",
  })),
});
