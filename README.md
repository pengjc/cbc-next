# Carolinas Blending Conference website

The home page covers the 2027 conference in Myrtle Beach and the Monday gospel trips. Update `app/page.tsx` as meeting times, registration, hotel booking and trip details become available; metadata is in `app/layout.tsx`. The 2027 venue photos in `public/2027/` came from Harold’s site visit.

The 2026 site is preserved at `/archive/2026`, including its announcements, messages and related pages. Its historical content and links are not current conference information. The original subpage URLs remain available with an archive notice. The archived announcement sources live in `content/announcements`, and `npm run build` compiles them into `content/announcements-compiled.json`. Audio and other shared archived assets are in `public/`.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run build` to compile announcements and generate the static site in `out/`. The project has existing AWS deployment scripts; deployment is a separate step.

## Staging

`npm run deploy:staging` builds a separate static export in `.next-staging/` and syncs it to the staging-only S3 bucket `cbc-staging-587629093059`. The command requires AWS CLI credentials with write and delete access to that bucket and removes staging objects absent from the build. It does not use the production bucket or CloudFront.

Staging is publicly readable at http://cbc-staging-587629093059.s3-website-us-east-1.amazonaws.com/ and uses HTTP, not HTTPS. The build requests that search engines do not index its pages; this is not access control. Do not publish private information there. Staging uses trailing-slash directory URLs for S3 website hosting. The normal production build and deployment retain their existing routing and output directory.

## Protected conference updates

The hero, welcome section, schedule and gospel-trip prompts, and dismissible floating bar all open one shared dialog. Visitors select email updates, WhatsApp, or both, then complete one Google reCAPTCHA Enterprise checkbox and press Continue. No email is required for WhatsApp alone. The floating bar appears after the hero leaves view; dismissal lasts for the browser session.

### API and data

`POST /subscriptions` now accepts JSON `{ "subscribeEmail": true, "joinWhatsapp": false, "email": "person@example.com", "captchaToken": "..." }`. Both choice flags must be booleans and at least one must be true. Email is required only when `subscribeEmail` is true. One Google assessment with action `conference_updates` verifies the token, configured site key and exact hostname before either action. Missing/invalid tokens return 403; provider outages/quota exhaustion or missing configuration return 503. Invalid requests return 400. There is no verification bypass.

A successful response contains `emailSubscribed` and, only if requested and verified, `inviteUrl`. All responses use `Cache-Control: no-store`. The invite is never included in the static export, frontend environment variables, or public scripts. Email storage remains a private DynamoDB Standard on-demand table with normalized `email` as primary key, `createdAt`, and `topic: conference-2027`. Conditional writes preserve duplicate handling. No confirmation emails or automated announcements are sent.

The API enforces allowed origins, a 16 KiB decoded request limit, bounded tokens, and throttling (2 requests/second, burst 5). Origin checks are not authentication; CAPTCHA validation is required even for duplicate addresses. Application logs omit addresses, tokens, API credentials, and invitations. Logs expire after 14 days. The table is retained if the stack is deleted.

### Google and AWS configuration

Google project: `cbc-conference-updates`. Billing is disabled; both choices share the organization’s free assessment allowance. Verification fails closed when Google cannot assess a request, including quota exhaustion. Production and the staging S3 website hostname share a domain-restricted checkbox key; localhost has a separate key. Both use balanced challenge settings, with no fixed testing response. The new WhatsApp invite is separate from the historical invite in the 2026 archive.

The Lambda reads two encrypted Standard SecureString parameters in `us-east-1`:

- `/cbc/conference-2027/recaptcha-api-key`: Google API credential restricted to `recaptchaenterprise.googleapis.com`.
- `/cbc/conference-2027/whatsapp-invite`: HTTPS group/community invite on `chat.whatsapp.com`.

Use a secure credential-handling process to create or update these parameters; never pass their values in command-line arguments, commit them, or print them to logs. The Lambda role has `ssm:GetParameter` for these two parameters and `dynamodb:PutItem` for the subscriber table, plus runtime logging permissions. Parameters are cached for five minutes; normal rotations take effect after that interval. Redeploy a new Lambda configuration to clear warm caches immediately if necessary. Revoke old Google credentials only after replacements are stored and verified. Resetting an invite in WhatsApp is necessary to invalidate previously shared invitations; CAPTCHA cannot prevent someone sharing a link after receiving it.

### Development and deployment

Requires AWS credentials, Google Cloud CLI authentication for Google configuration, SAM CLI, and Node.js 24 or newer. The backend is an independent `cbc-conference-signup` SAM stack in `us-east-1`.

```bash
aws sts get-caller-identity
npm ci --prefix infra/signup/function
npm run test:signup
sam validate --lint --template-file infra/signup/template.yaml --region us-east-1
npm run signup:deploy
aws cloudformation describe-stacks --stack-name cbc-conference-signup --region us-east-1 --query 'Stacks[0].Outputs'
gcloud recaptcha keys list --project=cbc-conference-updates
```

Set these public build-time values in ignored `.env.local`:

```text
NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT=<SubscriptionsEndpoint stack output>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<production checkbox key ID>
NEXT_PUBLIC_RECAPTCHA_LOCAL_SITE_KEY=<localhost checkbox key ID>
```

Restart development after changing environment values. A missing endpoint or required site key shows an unavailable message. Only the public keys and API URL belong in frontend configuration; the Google API credential and invite remain in Parameter Store. The SAM template configures server-side hostname-to-site-key mappings, which must match these keys.

Allowed API origins include the HTTPS production domain and its www variant, `http://cbc-staging-587629093059.s3-website-us-east-1.amazonaws.com`, and localhost:3000. The staging hostname maps to the production checkbox key, so staging builds use the same `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Staging and production use the same live subscriber table and WhatsApp invitation; remove staging test addresses after testing. Backend deployment does not publish either website; website deployment remains separate. There is no database migration and existing recipients remain intact.

Run tests, changed-file lint, and `npm run build`. Browser-check desktop/mobile, keyboard focus, the shared checkbox, expiry and retries, and bar dismissal. A user must complete real CAPTCHA challenges for live success testing. Use synthetic example.com addresses, confirm the intended DynamoDB record and invite response, then remove test records. Do not join the actual community as part of automated testing.

### Export recipients for manual emails

```bash
npm run signup:export -- --output exports/subscribers.txt
npm run signup:export -- --format csv --output exports/subscribers.csv
```

The command uses your AWS CLI credentials, resolves the table from the stack, and reads every page. It exports sorted, deduplicated addresses for `conference-2027` only. Optional flags: `--table TABLE`, `--stack STACK`, `--region REGION`. Credentials need `cloudformation:DescribeStacks` and `dynamodb:Scan` for this table (only `Scan` when `--table` is supplied). Exports must be placed in the ignored `exports/` directory, are created with owner-only permissions, and never overwrite an existing file. Use a fresh filename for each export. Recipient files contain personal data: keep them outside `public/`, `out/` and the website buckets. Copy recipients into Bcc when emailing manually. Export while signup traffic is quiet if you need a stable mailing cutoff; scans are paginated, not transactional snapshots.

### Remove an address

Normalize the requested address to lowercase and trim whitespace. Resolve the table using the stack output above, then run with authorized AWS credentials:

```bash
aws dynamodb delete-item --region us-east-1 --table-name TABLE_NAME --key '{"email":{"S":"person@example.com"}}'
```

This requires `dynamodb:DeleteItem` on the table. Remove the address from any previously exported mailing lists too. Since no suppression list is maintained, the person can sign up again later.

Run `npm run test:signup` for mocked verification, failure, combined-choice, deduplication, and paginated-export tests. Keep mocks confined to tests; never configure a production verification bypass.
