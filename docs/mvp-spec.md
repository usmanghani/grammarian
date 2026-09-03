# English Dependency Diagram Trainer: MVP specification

## 1. Product contract

The MVP is a responsive, web-first learning application that teaches English
sentence structure with word-level dependency diagrams. It uses Universal
Dependencies (UD) codes as its reviewed content model and configurable,
student-facing language in the interface.

The product is intended to validate whether learners can understand and build
dependency relationships. It is not intended to validate accounts, school
administration, automatic parsing, or a native application.

### 1.1 Audience configuration

The initial content profile is **US grades 5–8 (approximately ages 10–14)**.
This is a launch configuration, not an assumption embedded in components or
sentence data. A curriculum profile supplies at least:

| Setting | Initial value | Product effect |
| --- | --- | --- |
| `profileId` | `us-middle-school` | Stable identifier stored with lesson/content versions. |
| `gradeBand` | `5-8` | Selects lesson sequence and permitted concepts. |
| `vocabulary` | `simple` | Selects student-facing labels; `ud` remains available. |
| `locale` | `en-US` | Controls prose and examples, not UD codes. |
| `visibleLevels` | `1, 2, 3` | Limits lessons and picker choices. |
| `scoredPunctuation` | `false` | Excludes punctuation from structural scores by default. |

UI components receive resolved labels and available choices from the profile.
They must not infer a learner's age, hard-code grammar display text, or change
the stored UD analysis when a profile changes. Future grade bands may replace
terminology, explanations, examples, lesson order, and choice sets without
changing the diagram renderer.

## 2. Authoritative learning model

Each syntactic token has a part of speech, one head (except the root), and a
relation to that head. A sentence has exactly one root and its basic dependency
graph is a connected, acyclic tree. Stable token IDs—not array positions—are
used in saved answers.

Published exercise data is authoritative. Every published analysis is curated
and reviewed, and may contain explicitly reviewed alternatives. A parser may
produce offline drafts in later work, but parser output never grades a learner
at runtime and is never published automatically. Ambiguity receives credit
only through authored accepted alternatives.

The dependency diagram is a controlled, data-only view. It renders tokens,
parts of speech, and directed labeled edges and reports interactions through
callbacks. Lesson sequencing, scoring, persistence, and parser access remain
outside the renderer.

## 3. MVP scope

The MVP includes all of the following:

1. **Explore:** inspect a completed diagram, tokens, word classes, relations,
   and explanations; toggle labels; highlight a head family; and reveal a
   sentence one dependency at a time.
2. **POS practice:** assign a curriculum-appropriate part of speech to every
   token, check one token or all tokens, and preserve correct work on retry.
3. **Root selection:** select the organizing word and receive a conceptual hint
   before reveal.
4. **Head selection:** choose a highlighted dependent and then its head using
   tap/keyboard interactions; provisional connections can be reassigned.
5. **Relation labeling:** label a pre-drawn or newly built edge from a
   curriculum-limited picker, with different feedback for a wrong head and a
   wrong relation.
6. **Full parse:** assign POS labels, choose the root, connect dependents, label
   relations, save/resume, submit, and compare with an accepted analysis.
7. **Explanatory feedback:** correct-answer rationale, targeted misconception
   prompts, two hint levels, and reveal tracked separately from independent
   success.
8. **Curriculum:** 30 reviewed sentences—15 Level 1, 10 Level 2, and 5 Level 3—
   delivered as versioned static content. Level 1 excludes contractions,
   quotations, ellipsis, and intentional ambiguity.
9. **Local progress:** lesson completion, attempts, best scores, hint/reveal
   use, and concept evidence behind a `ProgressStore` interface using browser
   local storage with safe corruption recovery and reset/export controls.

The initial content build begins with five reviewed Level 1 sentences. Scaling
to 30 happens only after the graph and practice interaction are stable; the 30
sentence set remains part of the MVP release gate.

## 4. Screen contract

### 4.1 Home

The home screen introduces the distinction between **word class** and **job in
the sentence**, then provides clear links to Learn and Practice. It shows local
progress when available and does not require sign-in.

### 4.2 Lesson list

The lesson list shows level, concepts, completion state, and locked/unlocked
state. It supports a developer override for testing. Selecting a lesson opens
Explore; a completed prerequisite can unlock its successor.

### 4.3 Explore lesson

Explore shows one completed reviewed sentence at a time. The diagram, its token
row, and horizontal overflow share one scroll container. A learner can:

* select a token to read its word class, definition, and sentence-specific role;
* select an arc to read the relation and its explanation;
* show or hide POS badges, relation labels, and explanations;
* step forward/back through root, core arguments, noun modifiers, other
  modifiers, function words, and punctuation; and
* highlight a selected head and its immediate dependents.

The same information is available as a linear textual representation.

### 4.4 Practice setup

Practice setup identifies the lesson and exercise type: POS, root, head,
relation, or full parse. It explains the required tap sequence before the first
structural exercise and offers Continue/Resume when local state exists.

### 4.5 Guided practice

Each guided screen presents one explicit task, a structural progress indicator,
the relevant limited picker, Check, Hint, and Cancel controls, and a live
feedback region. Interaction follows **tap dependent, tap head, choose
relation**. Dragging may later be a shortcut but is never required. Correct work
survives retry; a correct head survives a relation-only correction.

### 4.6 Full practice

Full practice combines the four decision types. Learners may undo/delete work,
request incremental checks, or submit the full answer. Reload restores the
serialized session. Completion shows diagnostic POS, root, connections (UAS),
and connections + labels (LAS) results plus an accepted-analysis comparison.

### 4.7 Feedback and completion

Feedback first gives the shortest useful explanation and allows detail to
expand. A wrong head asks a guiding question; a correct head with a wrong label
preserves the edge. Hint 1 identifies a likely head family without disclosing
the answer, Hint 2 identifies the correct head, and Reveal explains the answer
and records assisted completion. Completion recommends Continue or a targeted
concept retry.

### 4.8 Local progress controls

A progress screen summarizes lesson completion and recent attempts and allows
export or reset. Unavailable or malformed browser storage produces a polite
warning and an in-memory session rather than blocking learning.

## 5. Explicit exclusions

The following are not part of the MVP:

* user accounts, authentication, cloud synchronization, or server persistence;
* classes, rosters, assignments, teacher dashboards, or student rankings;
* a live parser or authoritative parsing of learner-entered sentences;
* payments, subscriptions, purchasing, or billing;
* native iOS, Android, or desktop applications;
* free-form teacher authoring or publishing UI;
* adaptive algorithms beyond explicit prerequisites and targeted retry;
* automatic publication of parser-generated content; and
* a PWA manifest before the core responsive interaction is proven.

Structured files and validation scripts are the MVP authoring workflow. Offline
CoNLL-U tooling and parser-assisted drafts may support content production, but
neither expands the student-facing runtime scope.

## 6. Functional rules

### 6.1 Diagram and input

* Arrows point from a governing head to its dependent; the accessible name
  states both endpoints and the relation.
* Token and arc focus is visible. Arrow keys move through tokens, Enter/Space
  selects, and Escape or a visible Cancel clears a selection.
* Every arc has a wide invisible hit target separate from its visible stroke.
* Color reinforces but never solely communicates word class, relation, focus,
  correctness, hint, or reveal.
* Tokens and SVG arcs resize and horizontally scroll as one surface.

### 6.2 Content and scoring

* Runtime schemas reject duplicate IDs, discontinuous indices, incorrect text
  spans, missing/multiple roots, missing/duplicate heads, self-links, unknown
  labels, disconnected graphs, and cycles.
* Published items require sentence and edge explanations plus review metadata.
* Accepted alternatives pass the same validation as canonical trees.
* Exact accepted analyses earn full credit. Per-dependent scoring uses only the
  union of explicitly accepted pairs, never arbitrary parser output.
* Punctuation is excluded from UAS/LAS by default through profile configuration.
* A reveal is distinguishable from an independently correct response.

### 6.3 Privacy and operation

The MVP is statically deployable and needs no application server. Student
answers and entered interaction data remain in the browser. Analytics is a
no-op unless a later, privacy-reviewed integration is configured. Content and
schema versions accompany attempts so incompatible progress is migrated or
explicitly invalidated.

## 7. Responsive and accessibility acceptance criteria

The same capabilities exist on phone, tablet, and desktop; narrower layouts may
abbreviate visible tags while preserving full accessible names.

### 7.1 Phone

At 320 CSS pixels and a common modern-phone viewport:

* all screens work without page-level horizontal overflow;
* long sentences scroll only inside the shared diagram surface;
* arcs remain attached to tokens during scrolling and orientation/size changes;
* every action is completable with tap—no hover or drag dependency;
* controls have usable touch targets and no control, picker, label, or feedback
  is clipped; and
* the full POS exercise and basic connection flow can be completed end to end.

### 7.2 Tablet

In tablet portrait and landscape:

* controls reflow without obscuring the diagram or explanation panel;
* changing orientation preserves state and recomputes arc anchors;
* touch, external keyboard, and horizontal diagram scroll all work; and
* short sentences use available width without excessive empty diagram height.

### 7.3 Desktop

At laptop and wide-desktop widths:

* content has a readable maximum width while the diagram can use/scroll its
  required width;
* mouse, keyboard, and optional drag enhancement do not conflict;
* hover is supplementary and all hover information is focus-accessible; and
* direct navigation to a lesson route works after a static-host refresh.

### 7.4 Cross-viewport quality gate

At every target size and at 200% browser zoom:

* token/arc alignment is preserved for punctuation, long words, and sentences
  up to 18 syntactic words;
* focus order is logical and focus remains stable after check, retry, hint, and
  next sentence;
* all exercises are operable without a pointer and without color perception;
* visible focus and graphical controls meet applicable contrast requirements;
* reduced-motion preferences are respected; and
* light, dark, and high-contrast presentations remain legible.

## 8. MVP release gate

The MVP is releasable only when all 30 items are reviewed and validated; the
renderer passes phone, tablet, desktop, 200% zoom, touch, keyboard, and screen
reader smoke checks; scoring is deterministic across accepted alternatives;
pilot blockers in basic exercise completion are resolved; and content
validation, lint, strict type-check, unit/component tests, browser and
accessibility smoke tests, and a production static build all pass.
