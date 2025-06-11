import { Coordinate, CubeCoordinate, Sextant } from "../types";

const pointyHexCornerVectors = Array.from({ length: 6 }, (_, i) => {
  const angle = Math.PI / 3 * i - Math.PI / 6; // 60° * i - 30°
  return { x: Math.cos(angle), y: Math.sin(angle) };
});

const flatHexCornerVectors = Array.from({ length: 6 }, (_, i) => {
  const angle = Math.PI / 3 * i; // 60° * i
  return { x: Math.cos(angle), y: Math.sin(angle) };
});

/**
 * Get the hexagon points based on the center, apothem and orientation
 * @param center center of the hexagon
 * @param apothem distance from center to a vertex
 * @param orientation pointy or flat
 */
export const getHexPoints = (
  center: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat"
): Coordinate[] => {
  const vectors = orientation === "pointy" ? pointyHexCornerVectors : flatHexCornerVectors;

  return vectors.map(v => ({
    x: center.x + apothem * v.x,
    y: center.y + apothem * v.y
  }));
};

export const getHexCenter = (
  position: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd",
): Coordinate => {
  if (orientation === "pointy") {
    if (layout === "even") {
      return {
        x:
          position.x * Math.sqrt(3) * apothem -
          (position.y & 1) * apothem * Math.sqrt(3) / 2 +
          offset.x,
        y: position.y * 1.5 * apothem + offset.y,
      };
    } else {
      return {
        x: position.x * Math.sqrt(3) * apothem + offset.x,
        y: (position.y * 1.5 + 0.5) * apothem + offset.y,
      };
    }
  } else {
    if (layout === "even") {
      return {
        x: position.x * 1.5 * apothem + offset.x,
        y: position.y * Math.sqrt(3) * apothem + offset.y,
      };
    } else {
      return {
        x: (position.x * 1.5 + 0.5) * apothem + offset.x,
        y: position.y * Math.sqrt(3) * apothem + offset.y,
      };
    }
  }
};

/**
 * Get the hexagon points based on the position, offset, apothem and orientation
 * @param position q, r coordinates
 * @param offset center of the first hexagon
 * @param apothem distance from center to a vertex
 * @param orientation pointy or flat
 * @param layout even or odd
 * (https://www.redblobgames.com/grids/hexagons/#coordinates-offset)
 */
export const getHex = (
  position: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd",
): Coordinate[] => {
  if (orientation === "pointy") {
    if (layout === "even") {
      return getHexPoints(
        getHexCenter(position, offset, apothem, orientation, layout),
        apothem,
        orientation,
      );
    } else {
      return getHexPoints(
        getHexCenter(position, offset, apothem, orientation, layout),
        apothem,
        orientation,
      );
    }
  } else {
    if (layout === "even") {
      return getHexPoints(
        getHexCenter(position, offset, apothem, orientation, layout),
        apothem,
        orientation,
      );
    } else {
      return getHexPoints(
        getHexCenter(position, offset, apothem, orientation, layout),
        apothem,
        orientation,
      );
    }
  }
};

/**
 * Get the coordinates six neighbors of a hexagon
 * @param position q, r coordinates
 * @param orientation pointy or flat
 * @param layout even or odd
 */
export const getNeighbours = (
  position: Coordinate,
  orientation: "pointy" | "flat",
  layout: "even" | "odd",
): Coordinate[] => {
  if (orientation === "pointy") {
    if (layout === "even") {
      if (position.y % 2 === 0) {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x + 1, y: position.y - 1 },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x, y: position.y + 1 },
          { x: position.x + 1, y: position.y + 1 },
        ];
      } else {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x - 1, y: position.y + 1 },
          { x: position.x, y: position.y + 1 },
        ];
      }
    } else {
      if (position.y % 2 === 0) {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x, y: position.y + 1 },
        ];
      } else {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x + 1, y: position.y - 1 },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x, y: position.y + 1 },
          { x: position.x + 1, y: position.y + 1 },
        ];
      }
    }
  } else {
    if (layout === "even") {
      if (position.x % 2 === 0) {
        return [
          { x: position.x + 1, y: position.y + 1 },
          { x: position.x + 1, y: position.y },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x - 1, y: position.y + 1 },
          { x: position.x, y: position.y + 1 },
        ];
      } else {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x + 1, y: position.y - 1 },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x, y: position.y + 1 },
        ];
      }
    } else {
      if (position.x % 2 === 0) {
        return [
          { x: position.x + 1, y: position.y },
          { x: position.x + 1, y: position.y - 1 },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x, y: position.y + 1 },
        ];
      } else {
        return [
          { x: position.x + 1, y: position.y + 1 },
          { x: position.x + 1, y: position.y },
          { x: position.x, y: position.y - 1 },
          { x: position.x - 1, y: position.y },
          { x: position.x - 1, y: position.y + 1 },
          { x: position.x, y: position.y + 1 },
        ];
      }
    }
  }
};

/**
 * Get the q,r coordinates for the hexagon that contains the point
 * @param point the point to check
 * @param offset center of the first hexagon
 * @param apothem distance from center to a vertex
 * @param orientation pointy or flat
 * @param layout even or odd
 */
export const getHexCoordinates = (
  point: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd",
): Coordinate => {
  return axialToOffset(
    axialRound(pixelToAxial(point, offset, apothem, orientation)),
    orientation,
    layout,
  );
};

export const pixelToAxial = (
  point: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
): Coordinate => {
  if (orientation === "pointy") {
    const q =
      ((Math.sqrt(3) / 3) * (point.x - offset.x) -
        (1 / 3) * (point.y - offset.y)) /
      apothem;
    const r = ((2 / 3) * (point.y - offset.y)) / apothem;
    return { x: q, y: r };
  } else {
    const q = ((2 / 3) * (point.x - offset.x)) / apothem;
    const r =
      ((-1 / 3) * (point.x - offset.x) +
        (Math.sqrt(3) / 3) * (point.y - offset.y)) /
      apothem;
    return { x: q, y: r };
  }
};

export const axialRound = (point: Coordinate): Coordinate => {
  return cubeToAxial(cubeRound(axialToCube(point)));
};

export const axialToCube = (point: Coordinate): CubeCoordinate => {
  const q = point.x;
  const r = point.y;
  const s = -q - r;
  return { x: q, y: r, z: s };
};

export const cubeRound = (point: CubeCoordinate): CubeCoordinate => {
  let q = Math.round(point.x);
  let r = Math.round(point.y);
  let s = Math.round(point.z);

  const qDiff = Math.abs(q - point.x);
  const rDiff = Math.abs(r - point.y);
  const sDiff = Math.abs(s - point.z);

  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s;
  } else if (rDiff > sDiff) {
    r = -q - s;
  } else {
    s = -q - r;
  }

  return { x: q, y: r, z: s };
};

export const cubeToAxial = (point: CubeCoordinate): Coordinate => {
  return { x: point.x, y: point.y };
};

export const axialToOffset = (
  point: Coordinate,
  orientation: "pointy" | "flat",
  layout: "even" | "odd",
): Coordinate => {
  if (orientation === "pointy") {
    if (layout === "even") {
      return {
        x: point.x + (point.y + (point.y & 1)) / 2,
        y: point.y,
      };
    } else {
      return {
        x: point.x + (point.y - (point.y & 1)) / 2,
        y: point.y,
      };
    }
  } else {
    if (layout === "even") {
      return {
        x: point.x,
        y: point.y + (point.x + (point.x & 1)) / 2,
      };
    } else {
      return {
        x: point.x,
        y: point.y + (point.x - (point.x & 1)) / 2,
      };
    }
  }
};

// Utility: compare coordinates with tolerance
const sameCoord = (a: Coordinate, b: Coordinate, epsilon = 1) =>
  Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;

// Utility: convert a point to a string key (rounded to 3 decimal places)
const pointKey = (p: Coordinate) =>
  `${Math.round(p.x)},${Math.round(p.y)}`;

// Normalize edges to a consistent key
const edgeKey = (a: Coordinate, b: Coordinate): string => {
  const keyA = pointKey(a);
  const keyB = pointKey(b);
  return keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
};

/**
 * Get the outline of a group of hexes
 * @param hexes 
 * @param offset 
 * @param apothem 
 * @param orientation 
 * @param layout 
 * @returns 
 */
export const getHexGroupOutlines = (
  hexes: Coordinate[],
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Coordinate[][] => {
  if (!areHexesContiguous(hexes, orientation, layout)) throw new Error("Hexes are not contiguous");

  const edgeMap = new Map<string, { a: Coordinate; b: Coordinate; count: number }>();

  for (const hex of hexes) {
    const points = getHex(hex, offset, apothem, orientation, layout);
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      const key = edgeKey(a, b);
      if (edgeMap.has(key)) {
        edgeMap.get(key)!.count += 1;
      } else {
        edgeMap.set(key, { a, b, count: 1 });
      }
    }
  }

  const boundaryEdges = Array.from(edgeMap.values()).filter(e => e.count === 1);

  const pointMap = new Map<string, Coordinate[]>();
  for (const edge of boundaryEdges) {
    const fromKey = pointKey(edge.a);
    if (!pointMap.has(fromKey)) pointMap.set(fromKey, []);
    pointMap.get(fromKey)!.push(edge.b);
  }

  const visitedEdges = new Set<string>();
  const outlines: Coordinate[][] = [];

  const getNextEdgeKey = (a: Coordinate, b: Coordinate) => edgeKey(a, b);

  for (const edge of boundaryEdges) {
    const startKey = getNextEdgeKey(edge.a, edge.b);
    if (visitedEdges.has(startKey)) continue;

    const loop: Coordinate[] = [edge.a];
    let current = edge.b;
    let prev = edge.a;

    while (true) {
      loop.push(current);
      const neighbors = pointMap.get(pointKey(current)) || [];
      const next = neighbors.find(p => !visitedEdges.has(getNextEdgeKey(current, p)) && !visitedEdges.has(getNextEdgeKey(p, current)));
      visitedEdges.add(getNextEdgeKey(prev, current));

      if (!next || sameCoord(next, loop[0])) {
        break;
      }

      prev = current;
      current = next;
    }

    // Ensure the loop closes
    if (loop.length > 1 && !sameCoord(loop[0], loop[loop.length - 1])) {
      loop.push(loop[0]);
    }

    if (loop.length > 2) outlines.push(loop);
  }

  // Sort outlines: outer ring first (clockwise), holes afterward (counter-clockwise)
  outlines.sort((a, b) => Math.abs(polygonArea(b)) - Math.abs(polygonArea(a)));

  return outlines;
};

function polygonArea(points: Coordinate[]): number {
  let area = 0;
  for (let i = 0; i < points.length - 1; i++) {
    area += (points[i].x * points[i + 1].y - points[i + 1].x * points[i].y);
  }
  return area / 2;
}


export const areHexesContiguous = (
  hexes: Coordinate[],
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): boolean => {
  if (hexes.length === 0) return false;
  if (hexes.length === 1) return true;

  const key = (c: Coordinate) => `${c.x},${c.y}`;
  const hexSet = new Set(hexes.map(key));
  const visited = new Set<string>();

  const stack: Coordinate[] = [hexes[0]];
  visited.add(key(hexes[0]));

  while (stack.length > 0) {
    const current = stack.pop()!;
    const neighbors = getNeighbours(current, orientation, layout);

    for (const neighbor of neighbors) {
      const k = key(neighbor);
      if (hexSet.has(k) && !visited.has(k)) {
        visited.add(k);
        stack.push(neighbor);
      }
    }
  }

  return visited.size === hexes.length;
};

export const splitIntoContiguousHexGroups = (
  hexes: Coordinate[],
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Coordinate[][] => {
  const key = (c: Coordinate) => `${c.x},${c.y}`;
  const hexMap = new Map(hexes.map(h => [key(h), h]));
  const unvisited = new Set(hexMap.keys());
  const groups: Coordinate[][] = [];

  while (unvisited.size > 0) {
    // Start a new group from any unvisited hex
    const [startKey] = unvisited;
    const startHex = hexMap.get(startKey)!;

    const group: Coordinate[] = [];
    const stack: Coordinate[] = [startHex];
    unvisited.delete(startKey);

    while (stack.length > 0) {
      const current = stack.pop()!;
      group.push(current);

      const neighbors = getNeighbours(current, orientation, layout);
      for (const n of neighbors) {
        const nKey = key(n);
        if (unvisited.has(nKey)) {
          stack.push(hexMap.get(nKey)!);
          unvisited.delete(nKey);
        }
      }
    }

    groups.push(group);
  }

  return groups;
};

/**
 * Get the axial (q, r) coordinates of hexes in a ring at a given radius from a center hex.
 * Uses cube math for precision.
 * @param center Axial center coordinate (q, r)
 * @param radius Distance from the center hex (must be >= 1)
 * @returns Array of axial coordinates forming the ring
 */
export const getHexRingAxial = (
  center: Coordinate,
  radius: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Coordinate[] => {
  const ring = [];
  let hex = getNeighbours(center, orientation, layout)[4];
  for (let i = 0; i < radius - 1; i++) {
    hex = getNeighbours(hex, orientation, layout)[4];
  }
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      ring.push(hex);
      hex = getNeighbours(hex, orientation, layout)[i];
    }
  }
  return ring;
};

const offsetToAxial = (hex: Coordinate, orientation: "pointy" | "flat", layout: "even" | "odd") => {
  if (orientation === "pointy") {
    if (layout === "odd") {
      return {
        x: hex.x - (hex.y - (hex.y & 1)) / 2,
        y: hex.y,
      };
    } else {
      return {
        x: hex.x - (hex.y + (hex.y & 1)) / 2,
        y: hex.y,
      };
    }
  } else {
    if (layout === "odd") {
      return {
        x: hex.x,
        y: hex.y - (hex.x - (hex.x & 1)) / 2,
      };
    } else {
      return {
        x: hex.x,
        y: hex.y - (hex.x + (hex.x & 1)) / 2,
      };
    }
  }
}

const cubeSubtract = (a: CubeCoordinate, b: CubeCoordinate) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
}

const cubeDistance = (a: CubeCoordinate, b: CubeCoordinate) => {
  const diff = cubeSubtract(a, b);
  return (Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z)) / 2;
}

const axialDistance = (a: Coordinate, b: Coordinate) => {
  return cubeDistance(axialToCube(a), axialToCube(b));
}

// Get the distance in hexes between two hex coordinates
export const distanceBetweenHexes = (a: Coordinate, b: Coordinate, orientation: "pointy" | "flat", layout: "even" | "odd") => {
  return axialDistance(offsetToAxial(a, orientation, layout), offsetToAxial(b, orientation, layout));
};

function pointInTriangle(p: Coordinate, a: Coordinate, b: Coordinate, c: Coordinate): boolean {
  const area = (p1: Coordinate, p2: Coordinate, p3: Coordinate) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)

  const area1 = area(p, a, b)
  const area2 = area(p, b, c)
  const area3 = area(p, c, a)

  const hasNeg = (area1 < 0) || (area2 < 0) || (area3 < 0)
  const hasPos = (area1 > 0) || (area2 > 0) || (area3 > 0)

  return !(hasNeg && hasPos)
}

// Get the sextant of a hexagon given a map point position
export const getSextantFromPosition = (
  position: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Sextant => {
  const hex = getHexCoordinates(position, offset, apothem, orientation, layout)
  const hexOutline = getHex(hex, offset, apothem, orientation, layout)
  const center = getHexCenter(hex, offset, apothem, orientation, layout)

  const directionLabels: string[] =
    orientation === "pointy"
      ? ["e", "se", "sw", "w", "nw", "ne"]
      : ["n", "ne", "se", "s", "sw", "nw"]

  for (let i = 0; i < 6; i++) {
    const a = hexOutline[i]
    const b = hexOutline[(i + 1) % 6]

    if (pointInTriangle(position, center, a, b)) {
      const edgeMidpoint = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      }
      const centroid = {
        x: (center.x + a.x + b.x) / 3,
        y: (center.y + a.y + b.y) / 3,
      }
      return {
        outline: [center, a, b],
        direction: directionLabels[i],
        center,
        edgeMidpoint,
        centroid,
      }
    }
  }

  throw new Error("Position not inside any triangle of hex.")
}

// Get the sextants of a hexagon given a q, r coordinate
export const getSextantsFromHex = (
  hex: Coordinate,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Sextant[] => {
  const hexOutline = getHex(hex, offset, apothem, orientation, layout)
  const center = getHexCenter(hex, offset, apothem, orientation, layout)

  const directionLabels: string[] =
    orientation === "pointy"
      ? ["e", "se", "sw", "w", "nw", "ne"]
      : ["n", "ne", "se", "s", "sw", "nw"]

  const sextants: Sextant[] = []

  for (let i = 0; i < 6; i++) {
    const a = hexOutline[i]
    const b = hexOutline[(i + 1) % 6]

    const edgeMidpoint = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    }
    const centroid = {
      x: (center.x + a.x + b.x) / 3,
      y: (center.y + a.y + b.y) / 3,
    }
    sextants.push({
      outline: [center, a, b],
      direction: directionLabels[i],
      center,
      edgeMidpoint,
      centroid,
    })
  }
  return sextants
}

// Get the sextant that corresponds to the given compass direction for the given hexagon from a q, r coordinate
export const getSextantFromDirection = (
  hex: Coordinate,
  direction: string,
  offset: Coordinate,
  apothem: number,
  orientation: "pointy" | "flat",
  layout: "even" | "odd"
): Sextant => {
  const sextants = getSextantsFromHex(hex, offset, apothem, orientation, layout)
  const sextant = sextants.find(s => s.direction === direction);
  if (!sextant) {
    throw new Error(`Sextant ${direction} not found in hex ${hex.x},${hex.y}`)
  }
  return sextant
}