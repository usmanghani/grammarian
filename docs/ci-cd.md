# CI and CD

Sentence Lab uses GitHub Actions for quality gates and production deployment.

## Continuous integration

Every pull request and every push to `main` runs:

1. `npm ci`
2. curated-content validation
3. ESLint
4. strict TypeScript checking
5. production build and automated tests

The workflow is `.github/workflows/ci.yml`.

## Continuous deployment

The deploy workflow runs for pushes to `main` and can also be started manually. It repeats the complete test/build gate and then deploys the generated Cloudflare Worker and client assets from `dist/server/wrangler.json`.

Configure these repository or production-environment secrets before enabling deployment:

* `CLOUDFLARE_API_TOKEN`: a token allowed to deploy Workers and assets;
* `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the deployment.

The workflow uses a production environment and cancels an older in-progress deployment when a newer commit supersedes it. No student answers or lesson data are sent to CI; the MVP content remains versioned in the repository and progress remains browser-local.
