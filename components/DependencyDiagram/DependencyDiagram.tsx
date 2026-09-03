"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getPosLabel, getRelationLabel } from "@/lib/grammar/labels";
import { layoutEdges, type EdgeLayout } from "@/lib/grammar/layout";
import type { DependencyEdge, SentenceAnalysis, Token } from "@/lib/grammar/types";

type DependencyDiagramProps = {
  sentence: SentenceAnalysis;
  showPosByDefault?: boolean;
  showRelationsByDefault?: boolean;
};

type DiagramMetrics = {
  centers: Record<string, number>;
  width: number;
};

const TOKEN_FALLBACK_WIDTH = 94;
const MIN_CANVAS_WIDTH = 620;
const ARC_LANE_HEIGHT = 64;

export function DependencyDiagram({
  sentence,
  showPosByDefault = true,
  showRelationsByDefault = true,
}: DependencyDiagramProps) {
  const tokenRowRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [metrics, setMetrics] = useState<DiagramMetrics>({ centers: {}, width: 0 });
  const [showPos, setShowPos] = useState(showPosByDefault);
  const [showRelations, setShowRelations] = useState(showRelationsByDefault);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const row = tokenRowRef.current;
      if (!row) return;
      const rowRect = row.getBoundingClientRect();
      const centers: Record<string, number> = {};

      for (const token of sentence.tokens) {
        const element = tokenRefs.current[token.id];
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        centers[token.id] = rect.left - rowRect.left + rect.width / 2;
      }

      setMetrics({
        centers,
        width: Math.max(row.scrollWidth, rowRect.width),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (tokenRowRef.current) observer.observe(tokenRowRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sentence.tokens]);

  const fallbackCenters = useMemo(
    () =>
      Object.fromEntries(
        sentence.tokens.map((token, index) => [
          token.id,
          index * TOKEN_FALLBACK_WIDTH + TOKEN_FALLBACK_WIDTH / 2,
        ]),
      ),
    [sentence.tokens],
  );

  const tokenCenters = Object.keys(metrics.centers).length
    ? metrics.centers
    : fallbackCenters;
  const canvasWidth = Math.max(
    metrics.width,
    sentence.tokens.length * TOKEN_FALLBACK_WIDTH,
    MIN_CANVAS_WIDTH,
  );
  const rootEdge = sentence.canonicalEdges.find((edge) => edge.relation === "root");
  const rootToken = sentence.tokens.find((token) => token.id === rootEdge?.dependentId);
  const rootX = rootToken ? tokenCenters[rootToken.id] : canvasWidth / 2;
  const visibleEdges = sentence.canonicalEdges.filter((edge) => edge.relation !== "root");
  const [stepMode, setStepMode] = useState(false);
  const [revealedEdgeCount, setRevealedEdgeCount] = useState(visibleEdges.length);
  const displayEdges = stepMode ? visibleEdges.slice(0, revealedEdgeCount) : visibleEdges;
  const edgeLayouts = useMemo(
    () => layoutEdges(displayEdges, tokenCenters),
    [tokenCenters, displayEdges],
  );
  const maxLane = edgeLayouts.reduce((max, edge) => Math.max(max, edge.lane), 0);
  const svgHeight = Math.max(170, (maxLane + 1) * ARC_LANE_HEIGHT + 58);
  const selectedToken = sentence.tokens.find((token) => token.id === selectedTokenId);
  const selectedEdge = selectedEdgeIndex === null ? undefined : edgeLayouts[selectedEdgeIndex];

  function edgeDescription(edge: EdgeLayout): string {
    const head = edge.headId === "ROOT"
      ? "the sentence root"
      : sentence.tokens.find((token) => token.id === edge.headId)?.form ?? "unknown head";
    const dependent = sentence.tokens.find((token) => token.id === edge.dependentId)?.form ?? "unknown word";
    return `${getRelationLabel(edge.relation).longLabel} from ${head} to ${dependent}`;
  }

  function pathForEdge(edge: EdgeLayout): string {
    const baseline = 16;
    const laneY = 35 + edge.lane * ARC_LANE_HEIGHT;
    const bend = Math.max(28, Math.abs(edge.endX - edge.startX) * 0.32);
    const firstControlY = laneY;
    const secondControlY = laneY;
    const firstControlX = edge.startX + (edge.endX > edge.startX ? bend : -bend);
    const secondControlX = edge.endX - (edge.endX > edge.startX ? bend : -bend);
    return `M ${edge.startX} ${baseline} C ${firstControlX} ${firstControlY}, ${secondControlX} ${secondControlY}, ${edge.endX} ${baseline}`;
  }

  return (
    <section className="diagram-card" aria-label={`Dependency diagram for ${sentence.text}`}>
      <div className="diagram-toolbar">
        <div>
          <p className="eyebrow">Explore the structure</p>
          <p className="diagram-instruction">
            The arrow starts at a head and points to the word that depends on it.
          </p>
        </div>
        <div className="diagram-toggles" aria-label="Diagram display options">
          <Button
            type="button"
            size="sm"
            variant={showPos ? "secondary" : "outline"}
            aria-pressed={showPos}
            onClick={() => setShowPos((value) => !value)}
          >
            Word classes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={showRelations ? "secondary" : "outline"}
            aria-pressed={showRelations}
            onClick={() => setShowRelations((value) => !value)}
          >
            Relations
          </Button>
          <Button
            type="button"
            size="sm"
            variant={stepMode ? "secondary" : "outline"}
            aria-pressed={stepMode}
            onClick={() => {
              setStepMode((value) => !value);
              setRevealedEdgeCount(1);
            }}
          >
            {stepMode ? "Exit steps" : "Step through"}
          </Button>
        </div>
      </div>

      {stepMode ? (
        <div className="diagram-step-controls" aria-live="polite">
          <span>Showing {Math.min(revealedEdgeCount, visibleEdges.length)} of {visibleEdges.length} connections</span>
          <Button
            type="button"
            size="sm"
            onClick={() => setRevealedEdgeCount((count) => Math.min(visibleEdges.length, count + 1))}
            disabled={revealedEdgeCount >= visibleEdges.length}
          >
            Show next connection
          </Button>
        </div>
      ) : null}

      <div className="diagram-scroll" tabIndex={0} aria-label="Scrollable sentence diagram">
        <div className="diagram-canvas" style={{ width: `${canvasWidth}px` }}>
          <div className="diagram-root-band" style={{ width: `${canvasWidth}px` }}>
            <div className="root-marker" style={{ left: `${rootX}px` }}>
              <span className="root-marker-line" aria-hidden="true" />
              <span className="root-marker-label">MAIN WORD</span>
              <span className="root-marker-word">{rootToken?.form ?? ""}</span>
            </div>
          </div>

          <div className="diagram-token-row" ref={tokenRowRef}>
            {sentence.tokens.map((token) => {
              const posLabel = getPosLabel(token.upos);
              const isSelected = token.id === selectedTokenId;
              const hasOutgoing = sentence.canonicalEdges.some(
                (edge) => edge.headId === token.id,
              );
              return (
                <button
                  key={token.id}
                  ref={(element) => {
                    tokenRefs.current[token.id] = element;
                  }}
                  type="button"
                  className={`token-node token-family-${posLabel.colorFamily}${isSelected ? " is-selected" : ""}`}
                  aria-pressed={isSelected}
                  aria-label={`${token.form}, ${posLabel.accessibleDescription}${hasOutgoing ? " Has dependents." : ""}`}
                  onClick={() => {
                    setSelectedTokenId(token.id);
                    setSelectedEdgeIndex(null);
                  }}
                >
                  <span className="token-index">{token.index}</span>
                  <span className="token-form">{token.form}</span>
                  {showPos ? (
                    <span className="token-pos" data-family={posLabel.colorFamily}>
                      {posLabel.shortLabel}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <svg
            className="dependency-svg"
            width={canvasWidth}
            height={svgHeight}
            viewBox={`0 0 ${canvasWidth} ${svgHeight}`}
            role="img"
            aria-label={`Dependency relations for ${sentence.text}`}
          >
            <defs>
              <marker
                id="dependency-arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" className="dependency-arrowhead" />
              </marker>
            </defs>
            {edgeLayouts.map((edge, index) => {
              const relationLabel = getRelationLabel(edge.relation);
              const isSelected = selectedEdgeIndex === index;
              const labelText = edge.displayLabel ?? relationLabel.shortLabel;
              const labelWidth = Math.max(86, labelText.length * 7 + 28);
              const labelX = (edge.startX + edge.endX) / 2;
              const labelY = 30 + edge.lane * ARC_LANE_HEIGHT;
              return (
                <g
                  key={`${edge.headId}-${edge.dependentId}-${edge.relation}`}
                  className={`dependency-edge edge-family-${relationLabel.colorFamily}${isSelected ? " is-selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={edgeDescription(edge)}
                  onClick={() => {
                    setSelectedEdgeIndex(index);
                    setSelectedTokenId(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedEdgeIndex(index);
                      setSelectedTokenId(null);
                    }
                  }}
                >
                  <path
                    d={pathForEdge(edge)}
                    className="dependency-edge-hit"
                    fill="none"
                    stroke="transparent"
                    strokeWidth="22"
                    aria-hidden="true"
                  />
                  <path
                    d={pathForEdge(edge)}
                    className="dependency-edge-line"
                    fill="none"
                    markerEnd="url(#dependency-arrowhead)"
                  />
                  {showRelations ? (
                    <>
                      <rect
                        x={labelX - labelWidth / 2}
                        y={labelY - 21}
                        width={labelWidth}
                        height="26"
                        rx="13"
                        className="dependency-label-bg"
                        aria-hidden="true"
                      />
                      <text
                        x={labelX}
                        y={labelY - 4}
                        textAnchor="middle"
                        className="dependency-label"
                      >
                        {labelText}
                      </text>
                    </>
                  ) : null}
                  <title>{edgeDescription(edge)}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="diagram-legend" aria-label="Diagram legend">
        <span><i className="legend-swatch swatch-core" /> Core sentence roles</span>
        <span><i className="legend-swatch swatch-modifier" /> Describing words</span>
        <span><i className="legend-swatch swatch-function" /> Function words</span>
      </div>

      {selectedToken || selectedEdge ? (
        <aside className="diagram-inspector" aria-live="polite">
          <div className="inspector-copy">
            {selectedToken ? <TokenInspector token={selectedToken} sentence={sentence} /> : null}
            {selectedEdge ? <EdgeInspector edge={selectedEdge} sentence={sentence} /> : null}
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedTokenId(null);
              setSelectedEdgeIndex(null);
            }}
          >
            Close
          </Button>
        </aside>
      ) : (
        <p className="diagram-empty-state">Select a word or relation to inspect it.</p>
      )}

      <details className="diagram-text-alternative">
        <summary>Read the diagram as text</summary>
        <ol>
          {sentence.canonicalEdges.map((edge) => {
            const head = edge.headId === "ROOT"
              ? "main word"
              : sentence.tokens.find((token) => token.id === edge.headId)?.form ?? "unknown";
            const dependent = sentence.tokens.find((token) => token.id === edge.dependentId)?.form ?? "unknown";
            return (
              <li key={`${edge.headId}-${edge.dependentId}-${edge.relation}`}>
                {head} to {dependent}: {edge.displayLabel ?? getRelationLabel(edge.relation).shortLabel}
              </li>
            );
          })}
        </ol>
      </details>
    </section>
  );
}

function TokenInspector({ token, sentence }: { token: Token; sentence: SentenceAnalysis }) {
  const label = getPosLabel(token.upos);
  const edges = sentence.canonicalEdges.filter(
    (edge) => edge.dependentId === token.id || edge.headId === token.id,
  );
  return (
    <div>
      <p className="eyebrow">Word {token.index}</p>
      <h3>{token.form}</h3>
      <p>{label.longLabel}. {label.definition}</p>
      <p className="inspector-meta">{edges.length} relationship{edges.length === 1 ? "" : "s"} in this sentence.</p>
    </div>
  );
}

function EdgeInspector({ edge, sentence }: { edge: DependencyEdge; sentence: SentenceAnalysis }) {
  const label = getRelationLabel(edge.relation);
  const head = edge.headId === "ROOT"
    ? "main word"
    : sentence.tokens.find((token) => token.id === edge.headId)?.form ?? "unknown";
  const dependent = sentence.tokens.find((token) => token.id === edge.dependentId)?.form ?? "unknown";
  return (
    <div>
      <p className="eyebrow">Relationship</p>
      <h3>{label.shortLabel}</h3>
      <p>{head} points to {dependent}. {edge.explanation ?? label.definition}</p>
      <p className="inspector-meta">UD code: {edge.relation}</p>
    </div>
  );
}
