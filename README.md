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
