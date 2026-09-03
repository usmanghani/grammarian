# English Dependency Diagram Trainer

## Grammar taxonomy and display vocabulary

Status: checkpoint 1 grammar contract

## 1. Purpose

This document defines the grammar labels available to the curriculum and their student-facing presentation. Universal Dependencies (UD) codes are the stable internal/interchange vocabulary. The learner vocabulary is intentionally simpler and configurable by curriculum profile.

The taxonomy must be data-driven. Components may ask for a label’s short name, full name, definition, example, family, or minimum level, but they must not contain grammar-specific label strings in rendering or practice logic.

## 2. Vocabulary rules

1. Use the simplest accurate label for the current learner profile.
2. Show the standard UD code only in an optional detail view or expert profile.
3. Explain a relation in terms of what the dependent does with respect to its head.
4. Keep word class and sentence function visibly separate.
5. Use text and shape/state cues in addition to color.
6. Introduce one new concept at a time and reuse old concepts for practice.
7. Store all punctuation and structural information even when beginner exercises hide or exclude it.

## 3. POS tag taxonomy

UPOS tags are the internal part-of-speech values. “Minimum level” is the first curriculum level at which the tag may be required. Existing tags remain available in Explore mode when they occur in a reviewed sentence, even if they are not yet valid choices in a practice picker.

| UPOS | Student label | Full name | Definition | Example | Color family | Minimum level | Practice status |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| `NOUN` | noun | noun | A word naming a person, place, thing, or idea. | `dog`, `school` | noun | 1 | picker |
| `PROPN` | name | proper noun | A specific name of a person, place, organization, or thing. | `Maya`, `California` | noun | 1 | picker |
| `PRON` | pronoun | pronoun | A word used in place of a noun phrase. | `she`, `they` | noun | 1 | picker |
| `VERB` | verb | lexical verb | A word expressing an action, event, or state. | `run`, `chased` | verb | 1 | picker |
| `ADJ` | adjective | adjective | A word that describes a noun or pronoun. | `small`, `blue` | modifier | 1 | picker |
| `DET` | determiner | determiner | A word that specifies or limits a noun. | `the`, `a`, `this` | function | 1 | picker |
| `PUNCT` | punctuation | punctuation | A mark that separates or ends parts of writing. | `.`, `,`, `?` | punctuation | 1 | inspect-only by default |
| `ADV` | adverb | adverb | A word that modifies a verb, adjective, or another adverb. | `quickly`, `very` | modifier | 2 | picker |
| `AUX` | helping verb | auxiliary verb | A verb that helps express tense, mood, voice, or possibility. | `has`, `will`, `can` | verb | 2 | picker |
| `ADP` | preposition | adposition | A word that marks a relationship such as place, time, or direction. | `in`, `under`, `to` | function | 2 | picker |
| `PART` | particle | particle | A small function word with a grammatical role. | `not`, `to` | function | 2 | picker |
| `NUM` | number | numeral | A word expressing quantity or order. | `three`, `first` | noun | 2 | picker |
| `CCONJ` | connector | coordinating conjunction | A word joining equal words, phrases, or clauses. | `and`, `but`, `or` | function | 3 | picker |
| `SCONJ` | clause connector | subordinating conjunction | A word introducing a dependent clause. | `because`, `if`, `although` | function | 3 | picker |
| `INTJ` | interjection | interjection | A standalone expression of emotion or reaction. | `oh`, `wow` | discourse | post-MVP |
| `SYM` | symbol | symbol | A non-word symbol treated as a token. | `$`, `+` | punctuation | post-MVP |
| `X` | other | other | A token that does not fit another part-of-speech category. | foreign/unknown token | other | post-MVP |

### POS teaching notes

* The default profile distinguishes `VERB` from `AUX` so students can learn “main verb” versus “helping verb.”
* A copular word such as `is` may be tagged `AUX` or represented through the `cop` relation depending on the reviewed analysis. The student-facing explanation must say “linking verb” where appropriate.
* `PUNCT` remains in the sentence and diagram data but is not a required Level 1 answer unless a lesson explicitly teaches it.
* `PART` includes words whose school-grammar treatment may vary. Do not introduce `PART` until the relevant lesson supplies examples.

## 4. Dependency relation taxonomy

An edge is stored as `head -> dependent`, with the relation describing the dependent’s function. The renderer may later offer a reversed display direction to match another diagram convention, but scoring always uses the stored head and dependent IDs.

| UD relation | Short student label | Full name | Definition | Example edge | Color family | Minimum level | Practice picker |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| `root` | main word | root/main word | The word that organizes the sentence. | `chased -> ROOT` | core | 1 | picker |
| `nsubj` | subject | nominal subject | The person or thing that performs or experiences the main action/state. | `chased -> dog` | core | 1 | picker |
| `obj` | direct object | object | The person or thing directly affected by the action. | `chased -> ball` | core | 1 | picker |
| `det` | determiner | determiner | A word that specifies or limits a noun. | `dog -> the` | function | 1 | picker |
| `amod` | adjective modifier | adjectival modifier | An adjective that describes a noun. | `dog -> small` | modifier | 1 | picker |
| `advmod` | adverb modifier | adverbial modifier | An adverb modifying a verb, adjective, or another adverb. | `chased -> quickly` | modifier | 2 | picker |
| `aux` | helping verb | auxiliary | A helping verb attached to a main predicate. | `run -> will` | verb | 2 | picker |
| `cop` | linking verb | copula | A linking verb connecting a subject to a predicate description or identity. | `happy -> is` | verb | 2 | picker |
| `iobj` | indirect object | indirect object | A recipient or beneficiary of the direct object/action. | `gave -> child` | core | 2 | picker |
| `case` | preposition marker | case marker | A preposition marking the relationship of a noun phrase to another word. | `park -> in` | function | 2 | picker |
| `obl` | phrase modifier | oblique nominal | A noun phrase expressing place, time, manner, instrument, or another non-core role. | `runs -> park` | modifier | 2 | picker |
| `nmod:poss` | possessive modifier | possessive nominal modifier | A noun or pronoun identifying who owns or associates with another noun. | `book -> Maya` | modifier | 2 | picker |
| `compound` | compound word | compound modifier | A word that combines with another word as a lexical unit. | `school -> bus` | modifier | 2 | picker |
| `cc` | connector | coordinating conjunction | A coordinating word joining equal items. | `sell -> and` | function | 3 | picker |
| `conj` | coordinated word | conjunct | A coordinated item attached to another coordinated item. | `buy -> sell` | core | 3 | picker |
| `mark` | clause marker | marker | A word introducing a dependent clause. | `leave -> because` | function | 3 | picker |
| `xcomp` | open complement | open clausal complement | A non-finite verb complement whose subject is understood from another word. | `want -> leave` | clause | 3 | picker |
| `ccomp` | clause complement | clausal complement | A finite clause completing the meaning of a predicate. | `know -> left` | clause | 3 | picker |
| `acl` | noun clause modifier | clausal modifier of noun | A clause modifying a noun. | `book -> written` | clause | 3 | picker |
| `advcl` | clause modifier | adverbial clause modifier | A clause modifying the main clause, often expressing time, reason, or condition. | `left -> arrived` | clause | 3 | picker |
| `punct` | punctuation | punctuation relation | A punctuation token associated with a nearby syntactic word. | `chased -> .` | punctuation | 1 | inspect-only by default |

## 5. Deliberate simplifications

### 5.1 Root

The internal `root` relation is shown to beginners as “main word.” In many ordinary clauses this is the main verb. In copular sentences, the predicate description may be the UD root with the linking verb attached by `cop`. The explanation must focus on the organizing role rather than forcing a claim that every sentence’s root is a verb.

### 5.2 Prepositions: `case` and `obl`

UD commonly attaches a preposition to its noun phrase with `case`, then attaches that noun phrase to the governing predicate with `obl`. This is structurally precise but can surprise students who think of “in the park” as one unit.

The default UI therefore explains the pair together:

* `runs -> park` is the “place phrase” or “phrase modifier” connection;
* `park -> in` is the “preposition marker” connection.

The graph still displays and scores the two separate edges.

### 5.3 Copulas

For sentences such as `The sky is blue`, the default profile teaches `blue` as the predicate description/root and `is` as a linking verb attached by `cop`. The curriculum may include a school-grammar note that calls `is` the verb of the sentence. Both explanations must point to the same reviewed data rather than creating a second hidden analysis.

### 5.4 Coordination

UD attaches a conjunction word with `cc` and the second coordinated item with `conj`. The default student explanation is:

* `and` is the connector;
* `sell` is the coordinated word/phrase attached to `buy`.

Do not introduce coordination until students have stable understanding of root, subject, object, and modifiers.

### 5.5 Punctuation

Punctuation is included in the graph for faithful sentence representation, but it is inspect-only by default and excluded from structural scores. A later punctuation lesson can enable it in the picker without changing sentence data.

## 6. Relations excluded from the MVP picker

The following UD relations may exist in imported or future content but are not valid default student choices:

* `appos`;
* `clf`;
* `dep`;
* `discourse`;
* `dislocated`;
* `expl` and its subtypes;
* `fixed`;
* `flat` and its subtypes;
* `goeswith`;
* `list`;
* `nmod` without a configured subtype;
* `nummod`;
* `orphan`;
* `parataxis`;
* `reparandum`;
* `vocative`;
* enhanced-only relations and empty-node dependencies;
* language-specific subtypes not explicitly enabled by the curriculum profile.

These relations should either remain inspect-only, be rejected by the current content validator, or be introduced through a later taxonomy revision. They must not silently fall back to a generic “other” answer in a scored exercise.

## 7. Curriculum-level availability

### Level 1

POS: `NOUN`, `PROPN`, `PRON`, `VERB`, `ADJ`, `DET`, with `PUNCT` stored and generally inspect-only.

Relations: `root`, `nsubj`, `obj`, `det`, `amod`.

### Level 2

POS added: `ADV`, `AUX`, `ADP`, `PART`, `NUM`.

Relations added: `advmod`, `aux`, `cop`, `iobj`, `case`, `obl`, `nmod:poss`, `compound`.

### Level 3

POS added: `CCONJ`, `SCONJ`.

Relations added: `cc`, `conj`, `mark`, `xcomp`, `ccomp`, `acl`, `advcl`.

### Post-MVP

Consider `INTJ`, `SYM`, `X`, `appos`, `nummod`, `vocative`, expletives, fixed expressions, flat names, passive subtypes, enhanced dependencies, and empty nodes only after the authoring and validation model can represent them clearly.

## 8. Label configuration contract

Each POS and relation definition should expose at least:

```ts
type GrammarLabel = {
  code: string;
  shortLabel: string;
  longLabel: string;
  definition: string;
  example: string;
  colorFamily: string;
  minimumLevel: 1 | 2 | 3;
  pickerStatus: "picker" | "inspect-only" | "post-mvp";
  accessibleDescription: string;
};
```

A curriculum profile may replace `shortLabel`, `longLabel`, `definition`, and `accessibleDescription`, but it may not redefine the internal code or silently change the canonical graph semantics.

## 9. Content review checklist

Before publishing a sentence, a reviewer must confirm:

* every token has the intended POS;
* exactly one root is selected;
* every non-root token has the intended head;
* every edge uses an enabled relation;
* the diagram direction is clear from the legend;
* explanations use the current profile vocabulary;
* the sentence has no unintentional ambiguity for its level;
* any alternative analysis is explicit and independently reviewed;
* punctuation treatment is intentional;
* the sentence is appropriate for the reading-level profile.

