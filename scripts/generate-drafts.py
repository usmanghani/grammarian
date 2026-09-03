#!/usr/bin/env python3
"""Generate reviewed-content drafts from Stanza; never used by the web runtime."""

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Sentence Lab draft analyses")
    parser.add_argument("input", type=Path, help="UTF-8 file containing one sentence per line")
    parser.add_argument("output", type=Path, help="JSON output path")
    args = parser.parse_args()

    try:
        import stanza
    except ImportError as exc:
        raise SystemExit("Install tools/stanza-requirements.txt before generating drafts") from exc

    pipeline = stanza.Pipeline(
        "en",
        processors="tokenize,pos,lemma,depparse",
        download_method=None,
        verbose=False,
    )
    sentences = []
    for number, line in enumerate(args.input.read_text(encoding="utf-8").splitlines(), start=1):
        text = line.strip()
        if not text:
            continue
        document = pipeline(text)
        if len(document.sentences) != 1:
            raise SystemExit(f"line {number}: expected exactly one sentence")
        parsed = document.sentences[0]
        tokens = []
        edges = []
        for word in parsed.words:
            if word.id.__class__ is not int:
                raise SystemExit(f"line {number}: multiword and empty nodes are unsupported")
            start = word.start_char
            end = word.end_char
            tokens.append({"id": f"t{word.id}", "index": word.id, "form": word.text, "lemma": word.lemma, "upos": word.upos, "start": start, "end": end})
            edges.append({"dependentId": f"t{word.id}", "headId": "ROOT" if word.head == 0 else f"t{word.head}", "relation": word.deprel})
        sentences.append({"id": f"draft-{number}", "text": text, "language": "en", "tokens": tokens, "canonicalEdges": edges, "concepts": [], "difficulty": 1, "source": f"Stanza {stanza.__version__} draft; review required", "reviewStatus": "draft", "schemaVersion": 1})
    args.output.write_text(json.dumps(sentences, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
