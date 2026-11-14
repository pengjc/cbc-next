// Resolve the isolated stack on each staging build so local production settings
// cannot accidentally route staging registrations into the live database.
import { execFileSync } from "node:child_process";
const endpoint = execFileSync("aws", [
  "cloudformation", "describe-stacks", "--region", "us-east-1",
  "--stack-name", "cbc-registration-staging",
  "--query", "Stacks[0].Outputs[?OutputKey=='SubscriptionsEndpoint'].OutputValue",
  "--output", "text", "--no-cli-pager",
], { encoding: "utf8" }).trim();
if (!/^https:\/\/[a-z0-9]+\.execute-api\.us-east-1\.amazonaws\.com\/subscriptions$/.test(endpoint)) {
  throw new Error("Missing staging subscriptions endpoint.");
}
execFileSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, CBC_STAGING: "1", NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT: endpoint },
});
