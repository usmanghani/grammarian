# English Dependency Diagram Trainer

## MVP product specification

Status: checkpoint 1 product contract

## 1. Product definition

The English Dependency Diagram Trainer is a responsive web application for learning how words function in English sentences. It shows each sentence as a row of tokens with part-of-speech labels and a dependency graph of directed, labeled arcs. Students first inspect completed analyses and then practice assigning word classes, choosing the main word, connecting dependents to heads, and labeling those connections.

The application follows the dependency-graph style of the supplied Arabic reference. The product should feel visual and inspectable: a student can select any word or arc and learn what it does in this sentence.

## 2. Decisions for this MVP

### 2.1 Platform

The MVP is a web application, responsive from a 320-pixel-wide phone through a large desktop display. It is not a native iOS, Android, or desktop application. A Progressive Web App manifest is optional after the core interaction is stable.

The app must work without installing anything and must remain usable with touch, mouse, keyboard, and a screen reader.

### 2.2 Grammar representation

The canonical representation is a basic Universal Dependencies-style tree:

* each syntactic word has a stable ID, token text, and part-of-speech tag;
* each non-root word has exactly one head;
* each head-dependent connection has a dependency relation;
* one word is attached to a synthetic `ROOT` node;
* punctuation is represented in the data even when it is excluded from beginner scoring.

The display uses a head-to-dependent arrow convention and a persistent legend. The underlying data model must not depend on the visual direction of the arrow, so the display can later support a reference-matching direction toggle without changing answers or scores.

### 2.3 Teaching language

The application stores standard relation codes such as `nsubj`, `obj`, `det`, and `amod`, but the default learner vocabulary uses terms such as “subject,” “direct object,” “determiner,” and “adjective modifier.” The mapping is configuration data, not logic embedded in the diagram renderer.

### 2.4 Initial learner profile

The default curriculum profile is `elementary-intro`: an independent reader roughly in grades 3–5 who can read short English sentences but is new to formal sentence analysis. This is a pilot assumption, not a hard-coded age restriction.

The profile is represented as configuration with at least:

* `profileId`;
* reading-level target;
* maximum recommended sentence length;
* enabled POS labels;
* enabled dependency labels;
* explanation vocabulary;
* display density and default font size.

The same content and renderer must support future profiles such as `middle-school`, `adult-learner`, and `ud-expert` without changing the sentence analyses.

### 2.5 Source of truth

Published exercises are curated content. A parser may generate a draft for an author, but parser output is never an authoritative runtime grader. Every published item has a reviewed canonical analysis and can explicitly list accepted alternatives when more than one analysis is intentionally taught.

## 3. MVP goals

The MVP must allow a student to:

1. Understand the sentence, token, part-of-speech, head, dependent, and relation concepts.
2. Inspect a completed dependency diagram.
3. Practice part-of-speech labels separately from dependency labels.
4. Select a sentence root/main word.
5. Select a head for a highlighted dependent.
6. Select a relation for a pre-drawn or newly created edge.
7. Construct a complete analysis of a short sentence.
8. Find and repair a deliberately introduced diagram error.
9. Receive explanations that distinguish a wrong head from a wrong relation.
10. Resume local progress after a page reload.

The MVP should validate whether students understand the diagram and whether the interaction is usable on a phone before adding account and classroom infrastructure.

## 4. Explicit non-goals

The MVP does not include:

* user accounts or authentication;
* class rosters, assignments, or teacher analytics;
* a live parser in the student-facing application;
* free-form sentence entry as a graded activity;
* automatic publishing of parser analyses;
* payments, subscriptions, or advertising;
* native mobile applications;
* a general-purpose sentence diagram editor;
* constituency trees or Reed-Kellogg diagrams as a second view;
* contractions, quotations, ellipsis, or intentionally ambiguous sentences in Level 1;
* public student rankings;
* collection of student-entered text outside the browser.

The data and component interfaces must leave a clean path for these features later, but they must not delay the MVP interaction.

## 5. MVP content contract

### 5.1 Curriculum distribution

The MVP contains 30 reviewed English sentences:

* 15 Level 1 sentences with simple clauses;
* 10 Level 2 sentences with expanded clauses;
* 5 Level 3 sentences with multiple clauses or coordination.

Before expanding to all 30, implementation should prove the renderer and practice flow with five Level 1 sentences.

### 5.2 Level 1 content

Level 1 introduces nouns, proper nouns, pronouns, verbs, adjectives, determiners, the root/main word, subjects, direct objects, adjective modifiers, and determiner relations. Sentences contain three to seven syntactic words.

The seed set should include:

* at least one intransitive sentence;
* at least one transitive sentence;
* adjective modification;
* adverb modification as a clearly marked preview or later Level 2 concept;
* determiner modification.

### 5.3 Content metadata

Every sentence must include:

* stable sentence ID;
* surface text;
* tokenization and character spans;
* POS labels;
* canonical dependency edges;
* optional accepted alternatives;
* concepts practiced;
* difficulty level;
* student-facing explanations;
* source/provenance;
* reviewer and review timestamp;
* review status;
* schema version.

Published content is rejected by validation if it is missing a review record, explanation, or valid dependency tree.

## 6. Student screens and flows

### 6.1 Home/lesson selection

Purpose: let a student choose a lesson and see local progress.

Required elements:

* course title and short explanation;
* lesson cards with concept names and completion state;
* recommended next lesson;
* developer-only reset-progress control during MVP testing;
* accessible navigation to Explore and Practice.

### 6.2 Explore screen

Purpose: teach the visual grammar before asking for answers.

Required elements:

* sentence token row;
* optional POS badges;
* dependency arcs and labels;
* persistent arrow-direction legend;
* toggle for POS labels, relation labels, and explanations;
* token detail panel;
* edge detail panel;
* step-through mode that reveals dependencies in pedagogical order;
* a linear text alternative for the full diagram.

Selecting a token shows its form, word class, head, dependents, student-facing role, and a sentence-specific explanation. Selecting an edge shows its head, dependent, relation, and explanation.

### 6.3 Guided practice screen

Purpose: break parsing into one decision at a time.

Supported exercise types:

1. POS labeling: label highlighted tokens.
2. Root selection: choose the organizing word.
3. Head selection: connect a highlighted dependent to its head.
4. Relation labeling: choose the function of a pre-drawn edge.
5. Edge construction: choose dependent, head, and relation.
6. Find the error: repair one controlled mutation.

The baseline interaction is tap dependent, tap head, select relation. Dragging is optional desktop enhancement and is never the only way to answer.

### 6.4 Full-parse screen

Purpose: combine the skills in a complete short-sentence analysis.

The student assigns POS labels, chooses the root, creates all connections, labels all connections, and submits. The student can request incremental checking, undo a connection, reassign a head, or reveal the answer.

### 6.5 Feedback and completion

Feedback must be specific:

* correct response: concise reason;
* wrong POS: explain the word-class clue;
* wrong root: explain why the sentence is organized around another word;
* wrong head: explain what the dependent modifies or completes;
* right head, wrong relation: preserve the connection and explain the functional distinction;
* hint 1: suggest a reasoning question or likely head family;
* hint 2: identify the correct head or relation;
* reveal: show the answer and mark the attempt as revealed.

Completion shows concept-level results, not only one percentage. A student who gets all heads right but relation labels wrong should see that distinction.

## 7. Interaction and visual requirements

### 7.1 Diagram geometry

* Tokens and arcs share one horizontal scroll container.
* Token centers are measured after fonts load and whenever the container resizes.
* Arcs use deterministic lanes so the same sentence has stable geometry.
* Nested and overlapping spans receive separate lanes.
* Each arc has a visible path and a larger invisible hit target.
* Relation labels have enough padding to remain readable and clickable.
* The root has a visible synthetic anchor or a clearly documented root convention.

### 7.2 Input and focus

* Touch targets are at least comfortably usable on a phone.
* Tap selection is the primary interaction.
* Keyboard users can move through tokens, select a dependent, select a head, choose a relation, submit, request a hint, and cancel.
* Focus remains predictable after feedback, retry, and next-sentence actions.
* Escape or a visible cancel control clears an in-progress connection.

### 7.3 Visual semantics

* POS and relation families use consistent colors.
* Color is never the only indication of type or correctness.
* Visible labels may be abbreviated on narrow screens, but accessible names remain complete.
* Correct, incorrect, selected, hinted, and revealed states have distinct non-color cues.
* Support light, dark, and high-contrast themes.
* Respect reduced-motion preferences.

## 8. Scoring and progress

The scoring engine produces a deterministic versioned result:

* POS accuracy;
* root accuracy;
* unlabeled attachment score, displayed to students as “connections”;
* labeled attachment score, displayed as “connections + labels”;
* hint count;
* reveal flag;
* active time;
* concepts with evidence.

Punctuation is represented but excluded from structural scores by default. This must be configurable per exercise.

An answer matching the canonical analysis or an explicitly accepted alternative earns full credit. Unreviewed parser output is never implicitly accepted.

Progress is stored behind a `ProgressStore` interface. The MVP implementation uses local storage and stores content version, schema version, attempts, best results, hints, reveals, and concept evidence. Corrupt or unavailable storage must degrade gracefully and offer a reset path.

## 9. Privacy and safety

During MVP:

* sentence content and answers remain in the browser;
* no student-entered sentence or answer is sent to a remote parser;
* no account or personal information is required;
* analytics, if added, must use an explicit event interface and avoid raw student text;
* future collection of minor/student data requires a separate retention and consent design.

## 10. Acceptance criteria

### Product behavior

* A new student can open an Explore lesson and understand the token/POS/arc relationship without external instruction.
* A student can complete each guided exercise using taps alone.
* A student can complete each guided exercise using keyboard only.
* Wrong heads and wrong relations receive different feedback.
* Accepted alternatives are scored consistently.
* Progress survives reload and can be reset.
* All five seed sentences work before the curriculum is expanded to 30.

### Responsive behavior

Verify at minimum:

* 320px phone width;
* common phone width;
* tablet portrait;
* laptop width;
* wide desktop width;
* 200 percent browser zoom;
* long tokens and 18-token Level 3 sentences;
* horizontal scrolling with arcs remaining aligned to tokens.

No critical control may be clipped, detached from its target, or inaccessible at these sizes.

### Accessibility

* Every token and edge has a descriptive accessible name.
* Every diagram has a linear textual alternative.
* The full practice flow is possible without pointer input.
* Focus indicators are visible in all themes.
* Correctness and selection do not depend on color.
* Reduced-motion preferences are respected.

### Engineering quality

Before MVP release, linting, type checking, unit tests, component tests, browser smoke tests, content validation, accessibility checks, and production build must pass in CI.

## 11. Pilot questions

The first five-to-ten-student pilot should answer:

* Do students understand which way the arrow points?
* Can they identify a head without being told the parser terminology?
* Do they confuse POS labels with dependency labels?
* Is tap-dependent, tap-head, select-relation understandable without demonstration?
* Which explanations can they paraphrase?
* Which sentence lengths or arc shapes cause confusion?
* How often are hints or reveals needed?

Resolve interaction and explanation failures before adding account, class, or adaptive-learning features.

## 12. Deferred product decisions

The following decisions should be made after the pilot rather than assumed now:

* whether to add a traditional/constituency view;
* whether school curricula require a different label vocabulary;
* whether the reference application’s opposite arrow direction should be offered as a display option;
* what account and classroom model is appropriate;
* what evidence threshold should define mastery;
* whether free-form parsing is useful as an ungraded exploratory feature.

