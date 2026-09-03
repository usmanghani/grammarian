# English Dependency Diagram Trainer

## Product and implementation plan

## 1. Outcome

Build a responsive web application that teaches English sentence structure with word-level dependency diagrams and lets students practice constructing and labeling those diagrams.

The reference image uses three aligned representations:

1. The sentence split into tokens.
2. A part-of-speech label on each token.
3. Directed, labeled arcs connecting a governing word to each dependent word.

The English product should preserve that model while using simpler student-facing terms. Internally, analyses should follow Universal Dependencies (UD) so the data has a standard, documented representation.

## 2. Core product decisions

### 2.1 Use dependency grammar

Use a dependency tree rather than a Reed-Kellogg or constituency tree for the first version. Every syntactic word has:

* a part of speech;
* one head, except the root;
* a relation describing its function relative to its head.

Example: `The small dog chased the ball.`

* `chased` is the root/main verb;
* `dog` depends on `chased` as the subject;
* `ball` depends on `chased` as the object;
* `The` and `small` depend on `dog`;
* the second `the` depends on `ball`.

### 2.2 Separate the standard model from teaching language

Store UD codes internally, but show age-appropriate labels in the interface.

| Internal code | Default student label | Explanation |
| --- | --- | --- |
| `root` | main word | The word around which the sentence is organized. Usually the main verb. |
| `nsubj` | subject | Who or what performs or experiences the action/state. |
| `obj` | direct object | Who or what receives the action. |
| `iobj` | indirect object | Who or what receives the direct object. |
| `det` | determiner | A word such as *a*, *an*, *the*, *this*, or *some* that specifies a noun. |
| `amod` | adjective modifier | An adjective that describes a noun. |
| `advmod` | adverb modifier | An adverb that modifies a verb, adjective, or adverb. |
| `nmod:poss` | possessive modifier | A noun or pronoun that identifies possession. |
| `compound` | compound word | A word that combines with another word as a unit. |
| `aux` | helping verb | A verb that helps express tense, mood, or voice. |
| `cop` | linking verb | A form such as *is* that links a subject to a description or identity. |
| `case` | preposition marker | A preposition associated with a noun phrase. |
| `obl` | prepositional/oblique phrase | A noun phrase expressing time, place, manner, instrument, and similar roles. |
| `cc` | coordinating conjunction | A word such as *and*, *but*, or *or*. |
| `conj` | coordinated word/phrase | The additional item joined to the first. |
| `mark` | clause marker | A word such as *because*, *if*, or *that* introducing a clause. |
| `xcomp`, `ccomp` | verb/clause complement | A verb or clause that completes another predicate. |
| `acl`, `advcl` | dependent clause | A clause modifying a noun or main clause. |

The label dictionary must be configurable by curriculum or grade band. Do not hard-code display text into the graph component.

### 2.3 Curated analyses are authoritative

An NLP parser can generate a first draft, but it must not determine whether a student is correct at runtime. English analyses can be ambiguous, and automatic parsers make mistakes. Each published exercise must have a reviewed canonical analysis and may list accepted alternatives.

### 2.4 Build web-first and mobile-first

The MVP should be a responsive web app that works on desktop, tablet, and phone. Use a Progressive Web App manifest only after the main interaction works. Do not start with native mobile applications.

### 2.5 Optimize the MVP for validation

The first release should not require a backend:

* lessons and sentences are versioned JSON files;
* progress is stored in browser local storage;
* the site can be statically built and deployed;
* a content validation script prevents malformed exercises.

Add accounts, class management, and server persistence only after testing the learning interaction with students.

## 3. Primary user experiences

### 3.1 Explore mode

The student sees a completed dependency diagram.

* Tap a token to see its word class, definition, and role in this sentence.
* Tap an arc to see the relation between the two words.
* Toggle part-of-speech labels, dependency labels, and explanations.
* Step through the construction of the sentence, one dependency at a time.
* Highlight a head and all of its dependents as a group.

### 3.2 Guided practice

Break full parsing into small exercises:

1. Label each word's part of speech.
2. Select the root/main word.
3. Select the subject and object, where applicable.
4. For a highlighted dependent, select its head.
5. Label a pre-drawn dependency arc.
6. Build all dependency arcs for a short sentence.
7. Find and correct one error in a completed diagram.

### 3.3 Full practice

The student constructs the complete analysis:

1. Assign part-of-speech labels.
2. Choose the root.
3. Connect every remaining token to a head.
4. Label every dependency.
5. Submit the whole answer or request incremental checks.

Use tap interactions as the baseline: tap the dependent, tap its head, then select a relation. Dragging can be added as a desktop shortcut but should not be required on touch devices.

### 3.4 Feedback

Feedback should explain structure, not merely mark answers wrong.

* Correct: briefly state why the dependency works.
* Wrong head: identify the question the student should ask, such as “What does *small* describe?”
* Correct head, wrong relation: preserve the edge and ask the student to reconsider its function.
* Hint 1: highlight a likely head family, such as noun or verb.
* Hint 2: highlight the correct head.
* Reveal: show the answer and explanation; record it separately from an independently correct response.

### 3.5 Teacher/content-author mode

The later authoring interface should let a teacher:

* enter or paste a sentence;
* accept or edit tokenization;
* view a parser-generated draft;
* edit each token's part of speech;
* set the root, heads, and relations;
* add student-facing explanations;
* add accepted alternative analyses;
* assign difficulty, concepts, and lesson order;
* preview every practice mode;
* publish only after validation passes.

## 4. Curriculum

### Level 1: Simple clauses

* noun, proper noun, pronoun, verb, adjective, determiner;
* root/main verb;
* subject and direct object;
* adjective and determiner dependencies;
* sentences of three to seven syntactic words.

### Level 2: Expanded clauses

* adverbs;
* helping and linking verbs;
* indirect objects;
* prepositions and prepositional phrases;
* possessives and compounds;
* questions and commands;
* sentences of five to twelve syntactic words.

### Level 3: Multi-clause sentences

* coordination;
* infinitival and finite complements;
* relative clauses;
* adverbial clauses;
* passive voice;
* structurally ambiguous sentences;
* sentences of eight to eighteen syntactic words.

For the MVP, author 30 reviewed sentences: 15 Level 1, 10 Level 2, and 5 Level 3. Keep contractions, quotations, ellipsis, and intentionally ambiguous sentences out of Level 1.

## 5. Technical architecture

### 5.1 Recommended MVP stack

* Next.js with the App Router and TypeScript.
* React for UI state and reusable interaction components.
* SVG for tokens, arcs, arrowheads, relation labels, focus outlines, and hit targets.
* CSS variables for part-of-speech and relation-family colors.
* Zod or an equivalent runtime schema validator for lesson JSON.
* Vitest plus React Testing Library for unit/component tests.
* Playwright for browser and accessibility smoke tests.
* Local storage behind a `ProgressStore` interface.
* Static or edge deployment through Sites.

Do not use a general graph visualization library in the MVP. The diagram is a highly constrained one-dimensional token layout with curved edges. A small purpose-built SVG renderer will provide better touch behavior, accessibility, label positioning, and visual consistency.

### 5.2 Later production services

Add these only when required:

* PostgreSQL for users, classes, assignments, attempts, and mastery;
* authentication with student and teacher roles;
* a small Python Stanza service or offline batch job for draft parsing;
* object storage only if bulk curriculum imports require it;
* event analytics for exercise completion, hint use, and recurring misconceptions.

### 5.3 Component boundaries

```text
app/
  learn/[lessonId]/page.tsx
  practice/[lessonId]/page.tsx
  author/page.tsx                 # post-MVP
components/
  DependencyDiagram/
    DependencyDiagram.tsx
    TokenNode.tsx
    DependencyArc.tsx
    layout.ts
    interaction.ts
  Practice/
    PracticeSession.tsx
    PosLabelExercise.tsx
    RootExercise.tsx
    HeadSelectionExercise.tsx
    RelationExercise.tsx
    FullParseExercise.tsx
  Feedback/
lib/
  grammar/
    schema.ts
    labels.ts
    validation.ts
    scoring.ts
  curriculum/
  progress/
content/
  lessons/
scripts/
  validate-content.ts
  import-conllu.ts
tests/
```

The diagram renderer accepts data plus callbacks. It must not know about lesson sequencing, scoring, persistence, or parser APIs.

## 6. Data model

Use stable IDs rather than array positions in persisted answers.

```ts
type Token = {
  id: string;
  index: number;
  form: string;
  lemma?: string;
  upos: UposTag;
  xpos?: string;
  start: number;
  end: number;
};

type DependencyEdge = {
  dependentId: string;
  headId: string | "ROOT";
  relation: UdRelation;
  displayLabel?: string;
  explanation?: string;
};

type SentenceAnalysis = {
  id: string;
  text: string;
  language: "en";
  tokens: Token[];
  canonicalEdges: DependencyEdge[];
  acceptedAlternatives?: DependencyEdge[][];
  concepts: string[];
  difficulty: 1 | 2 | 3;
  explanation?: string;
  source?: string;
  reviewStatus: "draft" | "reviewed" | "published";
  schemaVersion: number;
};

type StudentParse = {
  sentenceId: string;
  posByTokenId: Record<string, UposTag>;
  edgeByDependentId: Record<string, Pick<DependencyEdge, "headId" | "relation">>;
  hintCount: number;
  revealed: boolean;
};
```

Validation invariants:

* token IDs are unique and indices are contiguous;
* character spans reproduce the original surface text;
* exactly one edge has `headId: "ROOT"`;
* every syntactic token has exactly one head;
* no token is its own head;
* the basic dependency structure is connected and acyclic;
* all labels exist in the selected curriculum taxonomy;
* every accepted alternative passes the same validation;
* published items have explanations and a recorded review state.

Support CoNLL-U import/export at the content tooling boundary. Keep the application JSON optimized for teaching rather than leaking ten-column CoNLL-U rows through the UI.

## 7. Diagram layout and interaction design

### 7.1 Layout algorithm

1. Render tokens in a horizontal row with one DOM anchor per token.
2. Measure token centers with `ResizeObserver` after fonts and layout settle.
3. Represent each edge as the interval between head and dependent token centers.
4. Sort edges by span length.
5. Assign non-overlapping edges to the lowest available lane; overlapping or nested edges move to higher lanes.
6. Draw each edge as an SVG cubic Bézier path from head to dependent.
7. Place an arrow marker at the dependent end.
8. Place the relation label near the curve midpoint with collision padding.
9. Draw the root connection from a synthetic `ROOT` anchor.
10. Recompute on resize, zoom, font change, and content change.

For sentences that do not fit the viewport, keep the token row and SVG inside the same horizontal scroll container. Never allow the arcs and tokens to scroll independently.

### 7.2 Input behavior

* Tap a token once to select it as the dependent.
* Tap another token to select it as the head.
* Show a compact relation picker near the selected pair.
* Allow Escape or a visible cancel action to clear selection.
* Allow keyboard users to move token focus with arrow keys, choose with Enter/Space, and cancel with Escape.
* Add optional pointer drag as progressive enhancement.
* Use a separate invisible, wide SVG stroke for every arc hit target.

### 7.3 Visual system

* Use consistent colors for part-of-speech families.
* Use both text labels and color; color must not carry correctness or grammar meaning alone.
* Keep correct, incorrect, selected, hinted, and revealed states visually distinct.
* Provide a high-contrast theme.
* On narrow screens, abbreviate visible tags but preserve full accessible names.

## 8. Scoring model

Score separate dimensions so feedback remains diagnostic.

* POS accuracy: correct token labels divided by token count.
* Root accuracy: whether the root token is correct.
* Unlabeled attachment score (UAS): correct head assignments divided by scored tokens.
* Labeled attachment score (LAS): correct head and relation assignments divided by scored tokens.
* Completion score: weighted combination configured by exercise type.
* Mastery: concept-level moving evidence, not one global percentage.

For school-facing UI, name UAS and LAS “connections” and “connections + labels.” Keep the technical names in analytics and developer tools.

If an answer matches any accepted analysis, award full credit. If only a subset is ambiguous, score each dependent against the union of explicitly accepted head/relation pairs. Never silently accept every output from an automatic parser.

## 9. Detailed build backlog

Each task below is intended to be independently executable and verifiable by Luna. Complete tasks in order unless a dependency explicitly allows parallel work.

### Milestone 0: Product contract

#### T0.1 Write the MVP specification

* Create `docs/mvp-spec.md`.
* Define the initial learner age/grade assumption as a configuration, not a buried UI assumption.
* State that MVP includes Explore, POS practice, root selection, head selection, relation labeling, full parse, feedback, 30 sentences, and local progress.
* State explicit exclusions: accounts, class rosters, live parser, payments, native apps, free-form teacher authoring.
* Add acceptance criteria for desktop, tablet, and phone.

Done when the document makes every MVP screen and excluded feature unambiguous.

#### T0.2 Define the grammar taxonomy

* Create `docs/grammar-taxonomy.md`.
* List allowed UPOS tags and dependency relations by level.
* Map each internal code to a short label, long label, definition, example, color family, and minimum curriculum level.
* Document deliberate simplifications, especially `case`, `obl`, copulas, and coordination.
* Mark relations that should not appear in the MVP picker.

Done when the UI can be generated from the taxonomy without hard-coded grammar labels.

### Milestone 1: Repository and quality gates

#### T1.1 Scaffold the web application

* Create a Next.js TypeScript application.
* Enable strict TypeScript, linting, formatting, and deterministic package scripts.
* Add app-wide design tokens and responsive breakpoints.
* Add a minimal landing page with links to Learn and Practice.
* Configure a static-compatible build unless a feature demonstrably requires a server runtime.

Verification: lint, type-check, test, and production build all pass from a clean install.

#### T1.2 Add test infrastructure

* Configure Vitest and React Testing Library.
* Configure Playwright for Chromium and mobile viewport smoke tests.
* Add one unit test, one component test, and one page navigation test to prove the harness.
* Add CI that runs install, content validation, lint, type-check, unit tests, browser smoke tests, and build.

Verification: intentionally breaking each gate causes CI to fail for the expected reason.

### Milestone 2: Grammar domain and content

#### T2.1 Implement schemas and validators

* Implement the types in Section 6.
* Add runtime schemas for every content file.
* Implement graph invariant checks: one root, one head per token, connected, acyclic, valid IDs, valid relations.
* Return errors containing the sentence ID, field, and actionable explanation.
* Add tests for valid trees and each invalid condition.

Verification: malformed fixtures fail with stable, readable errors; all valid fixtures pass.

#### T2.2 Implement label configuration

* Load student-facing labels from one taxonomy module or data file.
* Support a “simple” vocabulary and a “UD” vocabulary.
* Make label lookup exhaustive at compile time.
* Provide full accessible descriptions independently of abbreviated visible labels.

Verification: switching vocabulary changes labels without changing sentence data.

#### T2.3 Create seed curriculum

* Author five Level 1 sentences first.
* Manually review tokenization, POS, heads, relations, and explanations.
* Include at least one intransitive sentence, one transitive sentence, adjective modification, adverb modification, and a determiner.
* Add a content provenance/reviewer field.
* Expand to the 30-sentence distribution only after the graph and practice UX are stable.

Verification: all seed content validates and each dependency has a comprehensible student explanation.

#### T2.4 Add CoNLL-U import/export

* Implement a script that imports basic token, UPOS, HEAD, and DEPREL fields.
* Preserve surface text and multiword-token metadata where possible.
* Implement export for expert review and interoperability.
* Reject enhanced graphs and empty nodes initially with a precise unsupported-feature error.
* Add round-trip fixtures for supported sentences.

Verification: supported fixtures import, validate, export, and preserve the basic tree.

### Milestone 3: Dependency diagram renderer

#### T3.1 Render tokens and POS labels

* Build `DependencyDiagram` as a controlled, data-only component.
* Render token text, token index, and optional POS badge.
* Expose selected, correct, incorrect, hinted, and disabled states.
* Implement roving keyboard focus across tokens.
* Add Storybook or a local component gallery page for renderer states.

Verification: short and long words align correctly at desktop and phone widths.

#### T3.2 Implement dependency lane layout

* Write a pure function that maps token center coordinates and edges to lanes.
* Give deterministic output for the same inputs.
* Minimize height while preventing label overlap for common projective trees.
* Add unit tests for adjacent, nested, overlapping, leftward, rightward, and root edges.
* Document behavior for non-projective/crossing dependencies.

Verification: golden layout fixtures produce stable coordinates and lane numbers.

#### T3.3 Draw interactive SVG arcs

* Draw curved paths, dependent arrowheads, and relation labels.
* Add wide invisible pointer targets independent from visible stroke width.
* Add hover, focus, selected, correctness, and disabled states.
* Make arcs keyboard-focusable and provide accessible names such as “adjective modifier from dog to small.”
* Synchronize SVG width and horizontal scrolling with the token row.

Verification: every edge is selectable with mouse, touch, and keyboard; arcs remain anchored after resize.

#### T3.4 Add inspect and step-through modes

* Clicking a token opens its explanation panel.
* Clicking an edge opens its relation explanation.
* Step mode reveals one dependency at a time in pedagogical order: root, core arguments, noun modifiers, other modifiers, function words, punctuation.
* Add show/hide toggles for POS and relation labels.

Verification: a student can understand the five seed sentences without entering practice mode.

### Milestone 4: Practice engine

#### T4.1 Implement a practice state machine

* Model states explicitly: `answering`, `checking`, `feedback`, `completed`.
* Model selected dependent, selected head, pending relation, submitted answers, hint level, and reveal state.
* Keep reducer/state-machine logic independent from React components.
* Add unit tests for legal transitions and rejected illegal transitions.

Verification: reload can reconstruct a session from serialized state.

#### T4.2 Implement POS labeling

* Support tap-token then choose-label and optional drag-label interactions.
* Limit the picker to labels introduced in the current lesson.
* Support per-token check and check-all modes.
* Preserve correct work when retrying incorrect tokens.

Verification: the entire exercise is completable on a 320-pixel-wide viewport and with keyboard only.

#### T4.3 Implement root selection

* Ask the learner to select the sentence's organizing word.
* Give a concept-specific hint before revealing the root.
* Handle imperatives and copular clauses only after corresponding lessons introduce them.

Verification: correct, incorrect, hinted, and revealed paths are tested.

#### T4.4 Implement head selection and edge construction

* Use tap-dependent then tap-head as the primary interaction.
* Prevent self-links and links disallowed by the current scaffold.
* Draw provisional edges before relation selection.
* Allow deletion and reassignment before submit.
* Keep an undo stack for the current sentence.

Verification: a student can construct all heads for a seed sentence without relation labels.

#### T4.5 Implement relation labeling

* Present only curriculum-appropriate relation choices.
* Support labeling a pre-drawn edge and labeling a newly constructed edge.
* Order common choices first without changing answer semantics.
* Explain why the selected label fits or does not fit the chosen pair.

Verification: a correct head with an incorrect relation gets distinct feedback from an incorrect head.

#### T4.6 Implement full-parse mode

* Combine POS, root, head, and relation tasks.
* Add progress indicators based on completed structural decisions, not clicks.
* Support save/resume through the progress interface.
* Show a final comparison overlay between student and accepted analysis.

Verification: one full exercise works end to end across reloads.

#### T4.7 Implement “find the error” mode

* Generate exercises from reviewed controlled mutations: wrong POS, wrong root, wrong head, or wrong relation.
* Never create random malformed graphs without validating the intended single error.
* Ask the student to identify and correct the error.

Verification: every generated exercise contains exactly one targeted error.

### Milestone 5: Scoring, feedback, and progress

#### T5.1 Implement deterministic scoring

* Compute POS, root, UAS, LAS, hints, reveals, and elapsed active time.
* Compare against canonical and accepted alternative analyses.
* Exclude punctuation from structural scores by default, but make this configurable.
* Add property-based or exhaustive small-tree tests for scoring edge cases.

Verification: the same response and content version always produce the same score object.

#### T5.2 Build the feedback system

* Map error types to concept-specific prompts.
* Implement two hint levels plus reveal.
* Show the shortest useful explanation first with an expandable detailed explanation.
* Avoid giving the answer in the first generic hint.

Verification: every scored failure category has a non-empty, student-facing explanation.

#### T5.3 Implement local progress persistence

* Define a `ProgressStore` interface before implementing local storage.
* Store content/schema version with every attempt.
* Save lesson completion, best score, recent attempts, hints, and concept evidence.
* Handle unavailable/corrupt local storage without breaking practice.
* Add reset and export-progress controls.

Verification: progress survives reload, content upgrades are migrated or invalidated explicitly, and corrupted data recovers safely.

#### T5.4 Add lesson sequencing

* Define concept prerequisites.
* Unlock the next lesson based on completion, with a developer override.
* Recommend targeted retry when one concept is weak.
* Do not implement a complex adaptive algorithm until usage data exists.

Verification: unit tests cover unlock, retry, and completed-course states.

### Milestone 6: Content pipeline

#### T6.1 Add parser-assisted draft generation

* Create an offline Python script using Stanza to tokenize, tag, lemmatize, and generate UD dependencies.
* Output application draft JSON with `reviewStatus: "draft"`.
* Pin the parser model/version in generated metadata.
* Never publish parser output automatically.
* Keep this pipeline out of the student-facing runtime.

Verification: a sentence list produces valid drafts or precise validation failures.

#### T6.2 Add a reviewer workflow

For the MVP, this can be a local admin page or structured-file workflow.

* Display the generated diagram and editable token table together.
* Allow changing POS, root, head, relation, labels, and explanations.
* Re-run graph validation after each structural edit.
* Record reviewer and review timestamp.
* Export only reviewed/published content into the production bundle.

Verification: a parser error can be corrected without hand-editing opaque IDs.

#### T6.3 Complete the 30-sentence MVP curriculum

* Expand content according to Section 4.
* Ensure each introduced concept has at least three examples and two independent practice items.
* Run grammar review by a qualified English teacher or linguist.
* Run a reading-level and ambiguity pass.
* Add accepted alternatives only when each is intentionally teachable.

Verification: curriculum coverage report has no missing concepts or unreviewed published items.

### Milestone 7: Accessibility and responsive quality

#### T7.1 Complete keyboard and screen-reader behavior

* Provide a linear textual representation of every diagram.
* Give tokens and arcs descriptive accessible names and states.
* Maintain logical focus after check, retry, hint, and next sentence.
* Add skip links and live-region feedback where appropriate.

Verification: all exercises are completable without pointer input and without depending on color.

#### T7.2 Test responsive layout

* Test 320px phone, common modern phone, tablet portrait, laptop, and wide desktop.
* Confirm token and arc synchronization under horizontal scroll.
* Test browser zoom at 200 percent.
* Test long words, punctuation, and 18-token sentences.

Verification: screenshot tests show no clipped controls, detached arcs, or unreadable labels.

#### T7.3 Add reduced motion and contrast support

* Respect `prefers-reduced-motion`.
* Ensure focus indicators and graphical controls meet non-text contrast requirements.
* Test light, dark, and high-contrast themes.

Verification: automated accessibility checks pass and manual keyboard review has no blocker.

### Milestone 8: Deployment and pilot

#### T8.1 Prepare the web deployment

* Add production metadata, icons, error boundaries, and not-found handling.
* Add a privacy-preserving event interface that is a no-op until analytics is configured.
* Ensure no student-entered sentence or answer leaves the browser in MVP.
* Build and deploy a preview through Sites.

Verification: the production build loads directly on lesson routes and works after refresh.

#### T8.2 Run a small student pilot

Observe five to ten students completing Explore and Guided Practice.

Measure:

* whether students understand arrow direction;
* whether they can create an edge without instruction;
* confusion between POS labels and dependency labels;
* time per exercise;
* hint/reveal usage;
* viewport-specific problems;
* explanations they cannot paraphrase.

Do not add major backend features before resolving failures in the core diagram interaction.

#### T8.3 Define the MVP release gate

Release only when:

* all 30 sentences are reviewed and validated;
* the graph renderer passes phone, tablet, desktop, zoom, touch, and keyboard checks;
* scoring is deterministic across accepted alternatives;
* no critical pilot user is unable to complete a basic exercise;
* lint, type-check, unit, component, end-to-end, accessibility smoke, content validation, and production build pass.

### Milestone 9: Post-MVP productization

#### T9.1 Add accounts and server persistence

* Introduce `ProgressStore` server implementation without changing practice components.
* Add student, teacher, and administrator roles.
* Add anonymous-to-account progress migration.
* Define retention and deletion behavior before collecting minor student data.

#### T9.2 Add classes and assignments

* Let teachers create classes, assign lesson ranges, and view concept-level progress.
* Avoid ranking students publicly.
* Show misconceptions by concept and dependency relation.

#### T9.3 Add full authoring UI

* Add draft/review/publish lifecycle and content versioning.
* Add bulk sentence import and parser-assisted drafts.
* Add preview for every supported viewport and exercise type.
* Add rollback for published content.

#### T9.4 Add adaptive practice

* Use observed error evidence by concept.
* Select the next exercise from explicit prerequisites and spaced-retrieval rules.
* Preserve teacher overrides.
* A/B test only after defining learning outcomes and guardrails.

#### T9.5 Consider free-form sentence parsing

Treat this as an exploratory feature, not an authoritative grader.

* Label analyses as machine-generated.
* Allow users to report questionable parses.
* Explain ambiguity and show alternatives where possible.
* Never mix unreviewed machine parses into mastery scores.

## 10. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Students confuse word class with sentence function | High | Teach POS and dependency relations in separate early exercises; use distinct visual shapes and vocabulary. |
| Automatic parses are wrong | High | Use parser output only for drafts; require review before publication. |
| Valid English has multiple analyses | High | Store explicit accepted alternatives; avoid ambiguous early exercises. |
| Arcs become unreadable on phones | High | Use shared horizontal scrolling, deterministic lanes, abbreviated labels, and detail-on-tap. |
| Dragging is difficult on touch devices | High | Make tap-dependent, tap-head, select-relation the canonical interaction. |
| UD terminology is too technical | Medium | Keep UD as storage/interchange and provide configurable teaching labels. |
| Custom SVG renderer grows complex | Medium | Keep a small constrained API, pure layout functions, golden fixtures, and an accessible textual fallback. |
| Backend work delays validation | Medium | Ship static content and local progress first. |
| Content becomes inconsistent | High | Central taxonomy, runtime validation, review state, versioning, and CI coverage report. |

## 11. Counterarguments and decisions

### Use traditional sentence diagrams instead

Traditional diagrams may align better with some school curricula and explicitly show constituents such as noun phrases. However, they are harder to construct on a phone and differ substantially by teaching tradition. Dependency trees match the supplied reference and make student interaction a small set of discrete choices. Add a constituency or traditional view later if curriculum testing demands it.

### Use a parser live for every sentence

This makes free-form input impressive quickly. It also produces false confidence, unstable scoring, and hard-to-explain disagreements. The MVP should optimize for instruction, where a small reviewed corpus is more valuable than unlimited uncertain content.

### Add authentication and teacher dashboards first

These are necessary for a school product but do not validate whether students understand and enjoy the diagram interaction. The `ProgressStore` and content interfaces preserve a clean path to server persistence without putting it on the MVP critical path.

### Use a graph library

A graph library reduces initial drawing work, but most are optimized for general two-dimensional networks. This application needs tightly aligned tokens, grammar-specific lane layout, mobile scrolling, large touch targets, and accessible relation labels. A focused SVG renderer is likely smaller and more predictable.

## 12. Suggested execution sequence for Luna Max

Use one implementation checkpoint per line below. At each checkpoint, run all existing checks and report changed files, commands run, and remaining risks.

1. Execute T0.1 and T0.2.
2. Execute T1.1 and T1.2.
3. Execute T2.1 through T2.3 with only five seed sentences.
4. Execute T3.1 through T3.3 and provide desktop/mobile screenshots.
5. Execute T3.4.
6. Execute T4.1 through T4.3.
7. Execute T4.4 and T4.5.
8. Execute T4.6 and T4.7.
9. Execute T5.1 through T5.4.
10. Execute T7.1 through T7.3 before scaling content.
11. Execute T6.1 and T6.2.
12. Execute T6.3.
13. Execute T8.1 and deliver the preview.
14. Stop for the student pilot before T8.2, T8.3, or any Milestone 9 work.

Recommended first instruction after switching models:

> Read `english-dependency-trainer-build-plan.md` completely. Start with checkpoint 1 only. Make the product and grammar decisions explicit in the two documents, preserve the dependency-grammar and curated-content constraints, run relevant checks, then report results and stop for review.

## 13. References

* Universal Dependencies v2 relation inventory: https://universaldependencies.org/u/dep/index.html
* Universal Dependencies v2 CoNLL-U format: https://universaldependencies.org/format.html
* Stanford Stanza dependency parsing: https://stanfordnlp.github.io/stanza/depparse.html
* spaCy dependency parser API: https://spacy.io/api/dependencyparser/
* Next.js App Router documentation: https://nextjs.org/docs/app
* SVG path reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/path
* WCAG 2.2 non-text contrast guidance: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

