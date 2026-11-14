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

`npm run deploy:staging` builds a separate static export in `.next-staging/` and syncs it to the staging-only S3 bucket `cbc-staging-587629093059`. The command requires AWS CLI credentials with write and delete access to that bucket and removes staging objects absent from the build. It uses the staging bucket and its dedicated CloudFront distribution.

Staging registration is available at https://dytw413fchjuk.cloudfront.net/register/ through staging CloudFront distribution E1L7DEBJSI6IH0. Staging builds resolve the API from the isolated cbc-registration-staging stack in us-east-1. Its Cognito pool and DynamoDB records are separate from production. Use synthetic registrations. The underlying S3 website endpoint is HTTP-only; use the HTTPS CloudFront URL for registration.

## Protected conference updates

The homepage and dismissible floating bar link to `/register`. Requesting a registration email requires a reCAPTCHA Enterprise checkbox assessment for the action `conference_registration`, the configured key, and the exact allowed origin hostname. Redeeming a link enrolls the verified address in conference updates. Enrollment preserves existing subscriptions. Run `AWS_REGION=us-east-1 DATA_TABLE=<ConferenceTable> node infra/signup/function/backfill.mjs` to enroll previously verified accounts.

Signed-in families can open the WhatsApp invitation from any registration step. The authenticated `GET /registration/whatsapp` endpoint reads the invitation separately from family data. The old public subscriptions route is retired. The API still exposes its historical stack output for frontend endpoint discovery.

Google project `cbc-conference-updates` allows the production and HTTPS staging hosts on its checkbox key. Localhost uses a separate key. The API reads the encrypted parameters `/cbc/conference-2027/recaptcha-api-key` and `/cbc/conference-2027/whatsapp-invite` in us-east-1.

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

Local development uses the isolated registration API. Set NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT in .env.development.local to the staging SubscriptionsEndpoint output. When deploying cbc-registration-staging, keep both https://dytw413fchjuk.cloudfront.net and http://localhost:3000 in AllowedOrigins. The emailed link opens the HTTPS staging form. Test the public challenge on staging and confirm new and returning registrations appear once in the subscriber export.

### Export recipients for manual emails

```bash
npm run signup:export -- --output exports/subscribers.txt
npm run signup:export -- --format csv --output exports/subscribers.csv
```

The command uses your AWS CLI credentials, resolves the table from the stack, and reads every page. It exports sorted, deduplicated addresses for `conference-2027` only. Optional flags: `--table TABLE`, `--stack STACK`, `--region REGION`. Credentials need `cloudformation:DescribeStacks` and `dynamodb:Scan` for this table (only `Scan` when `--table` is supplied). Exports must be placed in the ignored `exports/` directory, are created with owner-only permissions, and never overwrite an existing file. Use a fresh filename for each export. Recipient files contain personal data: keep them outside `public/`, `out/` and the website buckets. Copy recipients into Bcc when emailing manually. Export while signup traffic is quiet if you need a stable mailing cutoff; scans are paginated, not transactional snapshots.

### Remove an address

Normalize the requested address to lowercase and trim whitespace. Resolve the table using the stack output above, then run with authorized AWS credentials:

```bash
aws dynamodb delete-item --region us-east-1 --table-name TABLE_NAME --key '{"pk":{"S":"SUBSCRIBER#person@example.com"},"sk":{"S":"conference-2027"}}'
```

This requires `dynamodb:DeleteItem` on the table. Remove the address from any previously exported mailing lists too. Since no suppression list is maintained, the person can sign up again later.

Run `npm run test:signup` for mocked verification, failure, combined-choice, deduplication, and paginated-export tests. Keep mocks confined to tests; never configure a production verification bypass.

### 2027 family registration rollout

Use us-east-1. Verify the SES domain identity for carolinasblendingconference.org using Easy DKIM in the existing Route 53 hosted zone, confirm SES production access and test delivery. Deploy the signup stack initially with RegistrationOpen=false. The stack creates ConferenceData alongside the retained Subscribers table and routes new subscriptions into ConferenceData. Set DATA_TABLE to the ConferenceTable stack output and LEGACY_TABLE to the SubscribersTable output. With operator credentials run:

    node infra/signup/function/rollout.mjs migrate
    node infra/signup/function/rollout.mjs migrate --apply

The migration copies existing subscriptions conditionally and reads them back before reporting success. Keep a backup of the legacy table and retire it after verification. Subscriber exports now resolve ConferenceTable. Test registration using an isolated stack and synthetic addresses on HTTPS. The frontend derives its registration API URL from NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT. Enable RegistrationOpen=true when deploying the tested stack, publish the HTTPS site, check live delivery and redemption, then preview and run the invitation send:

    node infra/signup/function/rollout.mjs invite
    node infra/signup/function/rollout.mjs invite --apply

Run a single invitation worker at a time. Repeating the command skips delivered invitations and verified registrations. The operator needs DynamoDB access and SES sending permission. Conference receipts and sign-in messages contain no family answers.

If the domain identity does not already exist, deploy infra/signup/sender.yaml with the existing Route 53 HostedZoneId to provision SES and its DKIM records. For isolated HTTPS testing set RegistrationOrigin to the test site and allow that origin on the API.
