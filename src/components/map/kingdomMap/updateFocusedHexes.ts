import { mapPointToLatlng } from "../utils/geometry";
import { getHex } from "../utils/hexagons";
import { Coordinate, Map } from "../types";

export const updateFocusedHexes = (focusedHexes: Coordinate[], map: Map, setAllFocusedHexes: (allFocusedHexes: Coordinate[][]) => void) => {
  if (focusedHexes && map) {
    const hexes: Coordinate[][] = [];
    focusedHexes.forEach((focusedHex: Coordinate) => {
      const outline = getHex(
        focusedHex,
        map.hexOffset,
        map.hexApothem,
        map.hexOrientation,
        map.hexLayout,
      );
      const latlngOutline = outline.map((p) => mapPointToLatlng(p, map));
      hexes.push(latlngOutline);
    });
    setAllFocusedHexes(hexes);
  }
};