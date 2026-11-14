import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";



const ssm = new SSMClient({});
const parameters = new Map();
export async function parameter(name) {
  const cached = parameters.get(name);
  if (cached && cached.expires > Date.now()) return cached.value;
  const result = await ssm.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
  const value = result.Parameter?.Value;
  if (!value) throw new Error("Missing configuration.");
  parameters.set(name, { value, expires: Date.now() + 300000 });
  return value;
}
