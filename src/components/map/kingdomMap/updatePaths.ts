import { HexOptions, HexWithLines, Map } from "../types";
import { getSextantsFromHex } from "../utils/hexagons";
import { mapPointToLatlng } from "../utils/geometry";

export const updatePaths = (map: Map, hexesWithLines: HexWithLines[], hexesWithLinesOptions: HexOptions[], setPaths: (paths: { path: (string | [number, number])[]; options: HexOptions }[]) => void) => {
  const directions = ["e", "se", "sw", "w", "nw", "ne"];
  const getDirectionCombinations = (hexWithLine: HexWithLines) => {
    const combinations: [string, string][] = [];
    for (const direction1 of directions) {
      if (hexWithLine[direction1 as keyof HexWithLines]) {
        for (const direction2 of directions) {
          if (hexWithLine[direction2 as keyof HexWithLines] && direction1 !== direction2 && !combinations.some(c => c[0] === direction2 && c[1] === direction1)) {
            combinations.push([direction1, direction2]);
          }
        }
      }
    }
    return combinations;
  };
  const isAdjacent = (direction1: string, direction2: string) => {
    return directions.indexOf(direction1) + 1 === directions.indexOf(direction2) || directions.indexOf(direction1) - 1 === directions.indexOf(direction2) || directions.indexOf(direction1) + 5 === directions.indexOf(direction2) || directions.indexOf(direction1) - 5 === directions.indexOf(direction2);
  };

  if (hexesWithLines && hexesWithLinesOptions) {
    const paths: {
      path: (string | [number, number])[];
      options: HexOptions;
    }[] = [];
    hexesWithLines.forEach((hexWithLine, idx) => {
      const sextants = getSextantsFromHex(hexWithLine.hex, map.hexOffset, map.hexApothem, map.hexOrientation, map.hexLayout).map(s => ({
        ...s,
        edgeMidpoint: mapPointToLatlng(s.edgeMidpoint, map),
        center: mapPointToLatlng(s.center, map),
        centroid: mapPointToLatlng(s.centroid, map),
        outline: s.outline.map((p) => mapPointToLatlng(p, map)),
      }));
      const options = hexesWithLinesOptions[idx];
      const combinations: [string, string][] = getDirectionCombinations(hexWithLine);
      if (combinations.length === 0) {
        for (const direction of directions) {
          if (hexWithLine[direction as keyof HexWithLines]) {
            const path: (string | [number, number])[] = [
              "M", [sextants[directions.indexOf(direction)].edgeMidpoint.y, sextants[directions.indexOf(direction)].edgeMidpoint.x],
              "L", [sextants[directions.indexOf(direction)].center.y, sextants[directions.indexOf(direction)].center.x],
            ];
            paths.push({
              path,
              options,
            });
          }
        }
      }
      for (const combination of combinations) {
        const path: (string | [number, number])[] = [];
        const sextant1 = sextants[directions.indexOf(combination[0])];
        const sextant2 = sextants[directions.indexOf(combination[1])];
        if (isAdjacent(combination[0], combination[1])) {
          path.push("M", [sextant1.edgeMidpoint.y, sextant1.edgeMidpoint.x]);
          path.push("C", [sextant1.centroid.y, sextant1.centroid.x], [sextant2.centroid.y, sextant2.centroid.x], [sextant2.edgeMidpoint.y, sextant2.edgeMidpoint.x]);
          paths.push({
            path,
            options,
          });
        } else {
          path.push("M", [sextant1.edgeMidpoint.y, sextant1.edgeMidpoint.x]);
          if (hexWithLine.useCenter) {
            path.push("L", [sextant1.centroid.y, sextant1.centroid.x]);
            path.push("Q", [sextant1.center.y, sextant1.center.x], [sextant2.centroid.y, sextant2.centroid.x]);
            path.push("L", [sextant2.edgeMidpoint.y, sextant2.edgeMidpoint.x]);
          } else {
            path.push("C", [sextant1.centroid.y, sextant1.centroid.x], [sextant2.centroid.y, sextant2.centroid.x], [sextant2.edgeMidpoint.y, sextant2.edgeMidpoint.x]);
          }
          paths.push({
            path,
            options,
          });
        }
      }
    });
    setPaths(paths);
  }
};