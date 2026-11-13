import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeEmail } from "../infra/signup/function/subscription.mjs";

const exec = promisify(execFile);
export async function collectSubscribers(scan) {
  const emails = new Set();
  let cursor;
  do {
    const page = await scan(cursor);
    for (const item of page.Items ?? []) {
      const email = normalizeEmail(item.email?.S);
      if (email && item.topic?.S === "conference-2027") emails.add(email);
    }
    cursor = page.LastEvaluatedKey;
  } while (cursor && Object.keys(cursor).length);
  return [...emails].sort();
}

export function formatSubscribers(emails, format) {
  if (format === "txt") return emails.length ? `${emails.join("\n")}\n` : "";
  if (format === "csv") return `email\n${emails.map(email => `"${email.replaceAll('"', '""')}"`).join("\n")}${emails.length ? "\n" : ""}`;
  throw new Error("Format must be txt or csv.");
}

async function main() {
  const options = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    if (!["--output", "--format", "--table", "--region", "--stack"].includes(args[i]) || !args[i + 1]) {
      throw new Error("Usage: npm run signup:export -- --output exports/subscribers.txt [--format txt|csv] [--table TABLE] [--region REGION] [--stack STACK]");
    }
    options[args[i].slice(2)] = args[i + 1];
  }
  if (!options.output) throw new Error("Specify --output exports/subscribers.txt (exports are private and ignored by Git).");
  const exportDir = fileURLToPath(new URL("../exports/", import.meta.url));
  const destination = resolve(options.output);
  const subpath = relative(exportDir, destination);
  if (!subpath || subpath.startsWith("..") || isAbsolute(subpath)) throw new Error("Output must be a file inside this repository’s exports/ directory.");
  const format = options.format ?? "txt";
  formatSubscribers([], format);
  const region = options.region ?? "us-east-1";
  const aws = async args => JSON.parse((await exec("aws", [...args, "--region", region, "--output", "json", "--no-cli-pager"], { maxBuffer: 8 * 1024 * 1024 })).stdout);
  let table = options.table;
  if (!table) {
    const result = await aws(["cloudformation", "describe-stacks", "--stack-name", options.stack ?? "cbc-conference-signup"]);
    table = result.Stacks?.[0]?.Outputs?.find(output => output.OutputKey === "SubscribersTable")?.OutputValue;
    if (!table) throw new Error("No SubscribersTable stack output found.");
  }
  const emails = await collectSubscribers(cursor => aws([
    "dynamodb", "scan", "--table-name", table, "--no-paginate", "--consistent-read",
    "--projection-expression", "email, #topic", "--expression-attribute-names", '{"#topic":"topic"}',
    ...(cursor ? ["--exclusive-start-key", JSON.stringify(cursor)] : []),
  ]));
  await mkdir(exportDir, { recursive: true, mode: 0o700 });
  // Exclusive creation avoids accidentally replacing an existing recipient list.
  await writeFile(destination, formatSubscribers(emails, format), { flag: "wx", mode: 0o600 });
  console.log(`Exported ${emails.length} addresses to ${options.output}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    // AWS stderr can include table contents or recipient data. Do not echo it.
    console.error("Export failed. Check arguments, AWS credentials, stack/table access, and that the output file does not already exist. See README.md for usage.");
    process.exitCode = 1;
  });
}
