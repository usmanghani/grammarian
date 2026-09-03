# Grammar taxonomy

## 1. Purpose and data contract

This taxonomy is the single source for grammar choices and student-facing
language in the English Dependency Diagram Trainer. Sentence data stores UD
codes. A curriculum profile selects a vocabulary (`simple` or `ud`), level,
and visible choices. The diagram receives already-resolved labels and accessible
descriptions; it never hard-codes the terms in this document.

Each future taxonomy record must expose these fields:

```ts
type TaxonomyEntry<Code extends string> = {
  code: Code;
  shortLabel: { simple: string; ud: string };
  longLabel: { simple: string; ud: string };
  definition: string;
  example: string;
  colorFamily: string;
  minimumLevel: 1 | 2 | 3;
  mvpPicker: boolean;
};
```

`shortLabel` is compact visible text. `longLabel` is the unabbreviated visible
or accessible name. `definition` remains available to assistive technology even
when the UI shows an abbreviation. Colors are stable semantic families, but
text always accompanies color. The UD vocabulary may display the code as its
short label and the official-style name as its long label.

`mvpPicker: false` means content validation may permit the code where specified,
but the code must not appear as an answer choice in the MVP. This is primarily
for punctuation and more technical subtypes that are assigned by reviewed
content rather than introduced as learner decisions.

## 2. Allowed UPOS tags by curriculum level

Levels are cumulative.

* **Level 1:** `NOUN`, `PROPN`, `PRON`, `VERB`, `ADJ`, `DET`, `PUNCT`.
* **Level 2 adds:** `ADV`, `AUX`, `ADP`, `CCONJ`, `PART`.
* **Level 3 adds:** `SCONJ`.

The UD tags `NUM`, `INTJ`, `SYM`, `X` are outside authored MVP lessons. They may
be added in a later taxonomy version, but must currently fail curriculum
validation rather than fall back to an unreviewed label.

### 2.1 UPOS entry table

| Code | Simple short / long label | UD short / long label | Definition | Example | Color family | Min. level | MVP picker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `NOUN` | noun / noun | NOUN / noun | A common-name word for a person, place, thing, or idea. | **dog** in “The dog ran.” | noun | 1 | Yes |
| `PROPN` | name / proper noun | PROPN / proper noun | The particular name of a person, place, organization, or similar entity. | **Maya** in “Maya waved.” | noun | 1 | Yes |
| `PRON` | pron. / pronoun | PRON / pronoun | A word used in place of a noun phrase. | **They** in “They laughed.” | noun | 1 | Yes |
| `VERB` | verb / main verb | VERB / verb | A word expressing an action, event, or state; in this curriculum it can head a predicate. | **chased** in “Dogs chased cats.” | verb | 1 | Yes |
| `ADJ` | adj. / adjective | ADJ / adjective | A word that describes or classifies a noun. | **small** in “the small dog” | modifier | 1 | Yes |
| `DET` | det. / determiner | DET / determiner | A word such as *a*, *the*, *this*, or *some* that specifies a noun. | **The** in “The dog ran.” | function | 1 | Yes |
| `PUNCT` | punct. / punctuation | PUNCT / punctuation | A written mark that organizes sentence text rather than naming a syntactic word class. | **.** in “Birds fly.” | punctuation | 1 | No |
| `ADV` | adv. / adverb | ADV / adverb | A word that modifies a verb, adjective, adverb, or clause. | **quickly** in “ran quickly” | modifier | 2 | Yes |
| `AUX` | help v. / auxiliary verb | AUX / auxiliary | A helping or linking verb that contributes tense, mood, voice, or copular meaning. | **can** in “can swim” | verb | 2 | Yes |
| `ADP` | prep. / adposition | ADP / adposition | In MVP English, a preposition associated with a noun phrase. | **in** in “in the pond” | function | 2 | Yes |
| `CCONJ` | coord. / coordinating conjunction | CCONJ / coordinating conjunction | A word joining parallel words, phrases, or clauses. | **and** in “cats and dogs” | conjunction | 2 | Yes |
| `PART` | particle / particle | PART / particle | A small function word that belongs with a verb or marks infinitival *to*. | **to** in “to swim” | function | 2 | Yes |
| `SCONJ` | clause word / subordinating conjunction | SCONJ / subordinating conjunction | A function word introducing a dependent clause. | **because** in “because rain fell” | conjunction | 3 | Yes |

## 3. Allowed dependency relations by curriculum level

Levels are cumulative. Only these basic-tree relations are accepted in MVP
content:

* **Level 1:** `root`, `nsubj`, `obj`, `det`, `amod`, `punct`.
* **Level 2 adds:** `advmod`, `iobj`, `aux`, `cop`, `case`, `obl`,
  `nmod:poss`, `compound`, `cc`, `conj`, `mark`, `xcomp`.
* **Level 3 adds:** `ccomp`, `acl`, `acl:relcl`, `advcl`, `nsubj:pass`,
  `aux:pass`, `obl:agent`.

The technical relations `punct`, `acl:relcl`, `nsubj:pass`, `aux:pass`, and
`obl:agent` are valid in reviewed content but intentionally absent from the MVP
picker. The UI teaches their broader family (`dependent clause`, `subject`,
`helping verb`, or `prepositional/oblique phrase`) and may display a reviewed
edge without asking a learner to distinguish the subtype. Picker policy can be
revised in a versioned curriculum profile after usability testing.

### 3.1 Dependency entry table

| Code | Simple short / long label | UD short / long label | Definition | Example | Color family | Min. level | MVP picker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `root` | main / main word | root / root | The word around which the sentence is organized, usually its main verb or predicate word. | `ROOT → **chased**` in “Dogs chased cats.” | core | 1 | Yes |
| `nsubj` | subj. / subject | nsubj / nominal subject | Who or what performs or experiences the action or state. | `chased → **dogs**` | core | 1 | Yes |
| `obj` | object / direct object | obj / object | Who or what directly receives or is affected by the action. | `chased → **cats**` | core | 1 | Yes |
| `det` | det. / determiner | det / determiner | A specifying word attached to a noun. | `dog → **the**` | noun-modifier | 1 | Yes |
| `amod` | adj. mod. / adjective modifier | amod / adjectival modifier | An adjective that describes the noun it depends on. | `dog → **small**` | noun-modifier | 1 | Yes |
| `punct` | punct. / punctuation | punct / punctuation | A punctuation mark attached to the sentence structure. | `ran → **.**` | punctuation | 1 | No |
| `advmod` | adv. mod. / adverb modifier | advmod / adverbial modifier | An adverb modifying a verb, adjective, adverb, or clause. | `ran → **quickly**` | modifier | 2 | Yes |
| `iobj` | indir. obj. / indirect object | iobj / indirect object | The noun phrase that receives the direct object. | `gave → **Maya**` in “I gave Maya a book.” | core | 2 | Yes |
| `aux` | helper / helping verb | aux / auxiliary | A verb helping another predicate express tense, mood, or non-passive voice. | `swim → **can**` | function | 2 | Yes |
| `cop` | linker / linking verb | cop / copula | A form of *be* or similar word linking a subject to a description or identity. | `happy → **is**` in “Ari is happy.” | function | 2 | Yes |
| `case` | prep. / preposition marker | case / case marker | A preposition attached to the noun phrase whose relationship it marks. | `park → **in**` in “played in the park” | function | 2 | Yes |
| `obl` | prep. phrase / prepositional or oblique phrase | obl / oblique nominal | A noun phrase expressing place, time, manner, instrument, or a similar circumstance. | `played → **park**` in “played in the park” | oblique | 2 | Yes |
| `nmod:poss` | possessive / possessive modifier | nmod:poss / possessive nominal modifier | A noun or pronoun identifying whose noun it is. | `book → **Maya’s**` | noun-modifier | 2 | Yes |
| `compound` | compound / compound word | compound / compound | A word that combines with another word as one naming unit. | `teacher → **science**` | noun-modifier | 2 | Yes |
| `cc` | joining word / coordinating conjunction | cc / coordinating conjunction | The conjunction associated with the additional coordinated item. | `dogs → **and**` in “cats and dogs” under the coordination convention below | function | 2 | Yes |
| `conj` | joined item / coordinated word or phrase | conj / conjunct | The additional word or phrase coordinated with the first. | `cats → **dogs**` in “cats and dogs” | coordination | 2 | Yes |
| `mark` | clause marker / clause marker | mark / marker | A function word introducing a dependent clause or infinitival complement. | `rained → **because**` | function | 2 | Yes |
| `xcomp` | open comp. / verb complement | xcomp / open clausal complement | A predicate complement whose understood subject is controlled by another sentence participant. | `wants → **swim**` in “Lee wants to swim.” | clause | 2 | Yes |
| `ccomp` | clause comp. / clause complement | ccomp / clausal complement | A finite/content clause completing another predicate and having its own expressed or understood subject. | `knows → **left**` in “Sam knows Mia left.” | clause | 3 | Yes |
| `acl` | noun clause / dependent clause modifying a noun | acl / clausal modifier of noun | A clause that modifies a noun. | `book → **written**` in “the book written yesterday” | clause | 3 | Yes |
| `acl:relcl` | relative cl. / relative clause | acl:relcl / relative clause modifier | A relative clause modifying a noun. | `book → **won**` in “the book that won” | clause | 3 | No |
| `advcl` | adv. clause / dependent adverbial clause | advcl / adverbial clause modifier | A clause expressing time, reason, condition, purpose, or a similar circumstance. | `stayed → **rained**` in “We stayed because it rained.” | clause | 3 | Yes |
| `nsubj:pass` | subj. / passive subject | nsubj:pass / passive nominal subject | The subject of a passive predicate—the participant affected by the action. | `opened → **door**` in “The door was opened.” | core | 3 | No |
| `aux:pass` | helper / passive auxiliary | aux:pass / passive auxiliary | A helping verb marking passive voice. | `opened → **was**` | function | 3 | No |
| `obl:agent` | by-phrase / agent phrase | obl:agent / agent oblique | The phrase naming the doer in a passive clause. | `opened → **teacher**` in “opened by the teacher” | oblique | 3 | No |

## 4. Deliberate teaching simplifications

### 4.1 Prepositions: `case` and `obl`

UD makes the noun the structural center of an English prepositional phrase.
Thus, in “Birds rested **in trees**,” `trees` depends on `rested` as `obl`, and
`in` depends on `trees` as `case`. The diagram must preserve those UD heads even
though traditional instruction may treat the preposition as the phrase head.

The simple vocabulary calls `case` **preposition marker** and `obl`
**prepositional/oblique phrase**. Early Level 2 explanations present these two
edges together: the noun phrase tells the circumstance, while the preposition
marks its relationship. The picker does not invent a generic “prepositional
phrase” edge from the verb to the preposition.

### 4.2 Copular clauses

UD treats the description or identity as the clause's structural head in basic
copular clauses. In “Ari **is happy**,” `happy` is the root, `Ari` is its
`nsubj`, and `is` is its `cop`. Student copy may say that *is* is the “linking
verb,” but the stored tree is not rearranged to make it the root.

Because this differs from many learners' expectation that every root is a verb,
copular root practice begins only in Level 2. Explanations define the main word
as the organizing predicate and say it is *usually*, not always, the main verb.

### 4.3 Coordination

For “cats and dogs,” UD attaches the additional item `dogs` to the first item
`cats` with `conj`; `and` attaches to `dogs` with `cc`. Shared dependents attach
according to the reviewed UD analysis and are not duplicated visually.

Student language uses **joined item** and **joining word**. The UI may highlight
the coordinated group, but the stored basic tree remains asymmetric. It does
not add a synthetic conjunction node or multiple heads. Coordination starts in
Level 2 for words/phrases; coordinated and subordinate clauses are Level 3.

### 4.4 Helping verbs, linking verbs, and passive voice

`aux` is shown as **helping verb** and `cop` as **linking verb** so their
different structural jobs are explicit. Passive subtypes (`aux:pass`,
`nsubj:pass`, `obl:agent`) are Level 3 and can be displayed from reviewed
content, but are not separate MVP picker choices. Introductory exercises use
the broader family label while explanations name the passive pattern.

### 4.5 Clause complements

The simple vocabulary groups `xcomp` and `ccomp` under **verb/clause
complement**, while accessible descriptions preserve the difference. `xcomp`
is introduced first with controlled infinitives; `ccomp` waits until Level 3.
Likewise, `acl`, `acl:relcl`, and `advcl` share the visible **dependent clause**
family but retain distinct UD codes and definitions.

### 4.6 Punctuation

Punctuation is represented so every surface token can have one head and the
diagram can reproduce reviewed UD content. It is not offered in the MVP
relation picker and is excluded from structural scores by default. POS practice
may display punctuation as prefilled/disabled rather than asking learners to
choose `PUNCT`.

## 5. Picker and validation rules

1. A lesson may offer only entries whose `minimumLevel` is no greater than the
   lesson level and whose `mvpPicker` value is true.
2. The picker should further narrow choices to concepts introduced by the
   current lesson; curriculum order, not observed frequency, determines
   eligibility.
3. Common choices may appear first, but ordering never changes scoring.
4. Content codes must resolve exhaustively. Unknown codes are validation errors;
   there is no generic display fallback.
5. Canonical and alternative analyses use the same allowed-code and level
   checks. An alternative cannot smuggle a later-level relation into a lesson.
6. Visible short labels may abbreviate at narrow widths. The long label,
   definition, endpoints, selection state, and correctness state remain in the
   accessible name/description.
7. Colors are CSS-token families rather than literal values in content. Themes
   provide light, dark, and high-contrast values and pair every color cue with
   text or shape.

## 6. Codes deliberately outside the MVP

Any UPOS tag or dependency relation not listed above is unsupported in MVP
published content. In particular, exercises do not introduce `NUM`, `INTJ`,
`SYM`, `X`, `appos`, `dep`, `discourse`, `dislocated`, `expl`, `fixed`, `flat`,
`goeswith`, `list`, `nmod` (other than `nmod:poss`), `orphan`, `parataxis`,
`reparandum`, or `vocative`. Enhanced dependencies, empty nodes, and multiple
heads are also outside the basic-tree teaching model.

Unsupported does not mean linguistically invalid. It means the concept lacks a
reviewed label, explanation, curriculum placement, interaction treatment, or
sufficient MVP examples. Adding one requires a versioned taxonomy update,
content validation changes, reviewed examples, and picker/accessibility copy.
