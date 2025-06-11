import { saveMap } from "../utils/fetch";
import { OnSelectPointFromModeArgs } from "../types";

export const onSelectPointEditBorders = ({ position, map, setMap, clickType }: OnSelectPointFromModeArgs) => {
  if (clickType === "left") {
    // Add the hex to the owned hexes
    const hex = position.hex;
    const ownedHexes = map.ownedHexes.some(h => h.x === hex.x && h.y === hex.y)
      ? map.ownedHexes.filter(h => h.x !== hex.x || h.y !== hex.y)
      : [...map.ownedHexes, hex];
    saveMap({ ...map, ownedHexes }, setMap);
  } else if (clickType === "right") {
    // Add the hex to the reconnoitered hexes
    const hex = position.hex;
    const reconnoiteredHexes = map.reconnoiteredHexes.some(h => h.x === hex.x && h.y === hex.y)
      ? map.reconnoiteredHexes.filter(h => h.x !== hex.x || h.y !== hex.y)
      : [...map.reconnoiteredHexes, hex];
    saveMap({ ...map, reconnoiteredHexes }, setMap);
  }
}