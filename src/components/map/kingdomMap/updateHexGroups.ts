import { mapPointToLatlng } from "../utils/geometry";
import { getHexGroupOutlines } from "../utils/hexagons";
import { Coordinate, Map } from "../types";

export const updateHexGroups = (hexGroups: Coordinate[][], map: Map, setHexGroupPolygons: (hexGroupPolygons: Coordinate[][][]) => void) => {
  if (hexGroups && map) {
    const polygons: Coordinate[][][] = [];
    hexGroups.forEach((hexGroup: Coordinate[]) => {
      const outlines = getHexGroupOutlines(
        hexGroup,
        map.hexOffset,
        map.hexApothem,
        map.hexOrientation,
        map.hexLayout,
      );
      const latlngOutlines = outlines.map((outline) =>
        outline.map((p) => mapPointToLatlng(p, map)),
      );
      polygons.push(latlngOutlines);
    });
    setHexGroupPolygons(polygons);
  }
};