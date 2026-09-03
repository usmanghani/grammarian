# Sentence Lab

Sentence Lab is a mobile-first web application for learning English sentence structure through dependency diagrams.

The first product slice includes:

* a reviewed Level 1 sentence;
* a token row with word classes;
* interactive dependency arcs and relation labels;
* touch, mouse, and keyboard inspection;
* Explore and Practice routes;
* a typed grammar model and content validator;
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

The student-facing MVP is intentionally browser-local. There is no live parser, authentication, classroom data, or remote storage in this slice.

## Repository structure

* `app/`: application routes and global styling
* `components/DependencyDiagram/`: token and SVG dependency rendering
* `lib/grammar/`: types, labels, validation, and layout functions
* `content/lessons/`: reviewed lesson JSON
* `docs/`: product and grammar contracts
* `tests/`: starter build and component checks

Read `english-dependency-trainer-build-plan.md` for the sequenced implementation backlog. The next implementation milestone is the practice state machine and answer checking.
