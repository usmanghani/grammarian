import type { UdRelation, UposTag } from "./types";

export type GrammarLabel = {
  code: string;
  shortLabel: string;
  longLabel: string;
  definition: string;
  example: string;
  colorFamily: "core" | "noun" | "verb" | "modifier" | "function" | "clause" | "punctuation";
  minimumLevel: 1 | 2 | 3;
  pickerStatus: "picker" | "inspect-only" | "post-mvp";
  accessibleDescription: string;
};

const pos = (
  code: UposTag,
  shortLabel: string,
  longLabel: string,
  definition: string,
  example: string,
  colorFamily: GrammarLabel["colorFamily"],
  minimumLevel: GrammarLabel["minimumLevel"],
  pickerStatus: GrammarLabel["pickerStatus"] = "picker",
): GrammarLabel => ({
  code,
  shortLabel,
  longLabel,
  definition,
  example,
  colorFamily,
  minimumLevel,
  pickerStatus,
  accessibleDescription: `${longLabel}. ${definition} Example: ${example}.`,
});

export const POS_LABELS: Record<UposTag, GrammarLabel> = {
  NOUN: pos("NOUN", "noun", "noun", "A word naming a person, place, thing, or idea.", "dog", "noun", 1),
  PROPN: pos("PROPN", "name", "proper noun", "A specific name of a person, place, organization, or thing.", "Maya", "noun", 1),
  PRON: pos("PRON", "pronoun", "pronoun", "A word used in place of a noun phrase.", "she", "noun", 1),
  VERB: pos("VERB", "verb", "lexical verb", "A word expressing an action, event, or state.", "chased", "verb", 1),
  ADJ: pos("ADJ", "adjective", "adjective", "A word that describes a noun or pronoun.", "small", "modifier", 1),
  DET: pos("DET", "determiner", "determiner", "A word that specifies or limits a noun.", "the", "function", 1),
  PUNCT: pos("PUNCT", "punctuation", "punctuation", "A mark that separates or ends parts of writing.", ".", "punctuation", 1, "inspect-only"),
  ADV: pos("ADV", "adverb", "adverb", "A word that modifies a verb, adjective, or another adverb.", "quickly", "modifier", 2),
  AUX: pos("AUX", "helping verb", "auxiliary verb", "A verb that helps express tense, mood, voice, or possibility.", "will", "verb", 2),
  ADP: pos("ADP", "preposition", "adposition", "A word that marks a relationship such as place, time, or direction.", "in", "function", 2),
  PART: pos("PART", "particle", "particle", "A small function word with a grammatical role.", "not", "function", 2),
  NUM: pos("NUM", "number", "numeral", "A word expressing quantity or order.", "three", "noun", 2),
  CCONJ: pos("CCONJ", "connector", "coordinating conjunction", "A word joining equal words, phrases, or clauses.", "and", "function", 3),
  SCONJ: pos("SCONJ", "clause connector", "subordinating conjunction", "A word introducing a dependent clause.", "because", "function", 3),
  INTJ: pos("INTJ", "interjection", "interjection", "A standalone expression of emotion or reaction.", "wow", "function", 3, "post-mvp"),
  SYM: pos("SYM", "symbol", "symbol", "A non-word symbol treated as a token.", "$", "punctuation", 3, "post-mvp"),
  X: pos("X", "other", "other", "A token that does not fit another part-of-speech category.", "unknown", "function", 3, "post-mvp"),
};

const relation = (
  code: UdRelation,
  shortLabel: string,
  longLabel: string,
  definition: string,
  example: string,
  colorFamily: GrammarLabel["colorFamily"],
  minimumLevel: GrammarLabel["minimumLevel"],
  pickerStatus: GrammarLabel["pickerStatus"] = "picker",
): GrammarLabel => ({
  code,
  shortLabel,
  longLabel,
  definition,
  example,
  colorFamily,
  minimumLevel,
  pickerStatus,
  accessibleDescription: `${longLabel}. ${definition} Example: ${example}.`,
});

export const RELATION_LABELS: Record<UdRelation, GrammarLabel> = {
  root: relation("root", "main word", "root/main word", "The word that organizes the sentence.", "chased is the main word", "core", 1),
  nsubj: relation("nsubj", "subject", "nominal subject", "The person or thing that performs or experiences the main action or state.", "chased -> dog", "core", 1),
  obj: relation("obj", "direct object", "object", "The person or thing directly affected by the action.", "chased -> ball", "core", 1),
  det: relation("det", "determiner", "determiner", "A word that specifies or limits a noun.", "dog -> the", "function", 1),
  amod: relation("amod", "adjective modifier", "adjectival modifier", "An adjective that describes a noun.", "dog -> small", "modifier", 1),
  advmod: relation("advmod", "adverb modifier", "adverbial modifier", "An adverb modifying a verb, adjective, or another adverb.", "chased -> quickly", "modifier", 2),
  aux: relation("aux", "helping verb", "auxiliary", "A helping verb attached to a main predicate.", "run -> will", "verb", 2),
  cop: relation("cop", "linking verb", "copula", "A linking verb connecting a subject to a predicate description or identity.", "happy -> is", "verb", 2),
  iobj: relation("iobj", "indirect object", "indirect object", "A recipient or beneficiary of the direct object or action.", "gave -> child", "core", 2),
  case: relation("case", "preposition marker", "case marker", "A preposition marking the relationship of a noun phrase to another word.", "park -> in", "function", 2),
  obl: relation("obl", "phrase modifier", "oblique nominal", "A noun phrase expressing place, time, manner, instrument, or another non-core role.", "runs -> park", "modifier", 2),
  "nmod:poss": relation("nmod:poss", "possessive modifier", "possessive nominal modifier", "A noun or pronoun identifying who owns or associates with another noun.", "book -> Maya", "modifier", 2),
  compound: relation("compound", "compound word", "compound modifier", "A word that combines with another word as a lexical unit.", "school -> bus", "modifier", 2),
  cc: relation("cc", "connector", "coordinating conjunction", "A coordinating word joining equal items.", "sell -> and", "function", 3),
  conj: relation("conj", "coordinated word", "conjunct", "A coordinated item attached to another coordinated item.", "buy -> sell", "core", 3),
  mark: relation("mark", "clause marker", "marker", "A word introducing a dependent clause.", "leave -> because", "function", 3),
  xcomp: relation("xcomp", "open complement", "open clausal complement", "A non-finite verb complement whose subject is understood from another word.", "want -> leave", "clause", 3),
  ccomp: relation("ccomp", "clause complement", "clausal complement", "A finite clause completing the meaning of a predicate.", "know -> left", "clause", 3),
  acl: relation("acl", "noun clause modifier", "clausal modifier of noun", "A clause modifying a noun.", "book -> written", "clause", 3),
  advcl: relation("advcl", "clause modifier", "adverbial clause modifier", "A clause modifying the main clause, often expressing time, reason, or condition.", "left -> arrived", "clause", 3),
  punct: relation("punct", "punctuation", "punctuation relation", "A punctuation token associated with a nearby syntactic word.", "chased -> .", "punctuation", 1, "inspect-only"),
};

export function getPosLabel(tag: UposTag): GrammarLabel {
  return POS_LABELS[tag];
}

export function getRelationLabel(relationCode: UdRelation): GrammarLabel {
  return RELATION_LABELS[relationCode];
}
