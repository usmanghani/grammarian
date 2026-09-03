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

The deploy workflow runs for pushes to `main` and can also be started manually. It repeats the content, lint, type-check, and Next.js production build gates, then deploys a prebuilt artifact to Vercel.

Configure these repository or production-environment secrets before enabling deployment:

* `VERCEL_TOKEN`: a Vercel personal or team token allowed to deploy;
* `VERCEL_ORG_ID`: the Vercel team ID, or the account ID for a personal project;
* `VERCEL_PROJECT_ID`: the Vercel project ID associated with this repository.

The workflow uses a production environment and cancels an older in-progress deployment when a newer commit supersedes it. No student answers or lesson data are sent to CI; the MVP content remains versioned in the repository and progress remains browser-local.

## Content drafts

Parser-assisted drafts are generated offline with `scripts/generate-drafts.py` and `tools/stanza-requirements.txt`. The script records the parser version and always emits `reviewStatus: "draft"`; the content validator must pass again after a teacher or linguist reviews the graph before it can be published.
