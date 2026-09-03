import type { DependencyEdge } from "./types";

export type EdgeLayout = DependencyEdge & {
  lane: number;
  startX: number;
  endX: number;
  span: number;
};

type LaneInterval = { left: number; right: number };

export function layoutEdges(
  edges: DependencyEdge[],
  tokenCenters: Record<string, number>,
  rootX?: number,
): EdgeLayout[] {
  const rootAnchor = rootX ?? 0;
  const sorted = [...edges]
    .map((edge) => {
      const startX = edge.headId === "ROOT" ? rootAnchor : tokenCenters[edge.headId];
      const endX = tokenCenters[edge.dependentId];
      const left = Math.min(startX, endX);
      const right = Math.max(startX, endX);
      return { edge, startX, endX, left, right, span: right - left };
    })
    .filter((item) => Number.isFinite(item.startX) && Number.isFinite(item.endX))
    .sort((a, b) => b.span - a.span || a.left - b.left);

  const lanes: LaneInterval[][] = [];
  return sorted.map(({ edge, startX, endX, left, right, span }) => {
    let lane = 0;
    while (lanes[lane]?.some((interval) => overlaps(interval, { left, right }))) {
      lane += 1;
    }
    lanes[lane] ??= [];
    lanes[lane].push({ left, right });
    return { ...edge, lane, startX, endX, span };
  });
}

function overlaps(a: LaneInterval, b: LaneInterval): boolean {
  return a.left < b.right && b.left < a.right;
}
