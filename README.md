# Sentence Lab

Sentence Lab is a mobile-first web application for learning English sentence structure through dependency diagrams.

The current product slice includes:

* five reviewed Level 1 sentences;
* a token row with word classes;
* interactive dependency arcs and relation labels;
* touch, mouse, and keyboard inspection;
* Explore and Practice routes with sentence navigation;
* guided root, POS, head/relation, full-parse, and find-the-error exercises;
* deterministic scoring and browser-local best progress;
* a typed grammar model, Zod schemas, and content validator;
* product and grammar contracts in `docs/`.

## Local development

The project uses the bundled Vinext/Sites runtime.

```bash
npm run install:ci
npm run content:validate
npm run lint
npm run build
npm test
```

The student-facing MVP is intentionally browser-local. There is no live parser, authentication, classroom data, or remote storage in this slice. Vercel deployment is defined in `.github/workflows/deploy.yml` and requires the documented Vercel secrets.

## Repository structure

* `app/`: application routes and global styling
* `components/DependencyDiagram/`: token and SVG dependency rendering
* `lib/grammar/`: types, labels, validation, and layout functions
* `content/lessons/`: reviewed lesson JSON
* `scripts/conllu.mjs`: basic CoNLL-U import/export for review tooling
* `docs/`: product and grammar contracts
* `.github/workflows/`: CI quality gates and Vercel production deployment
* `tests/`: build and component checks

Read `english-dependency-trainer-build-plan.md` for the sequenced implementation backlog and `docs/ci-cd.md` for deployment setup.
