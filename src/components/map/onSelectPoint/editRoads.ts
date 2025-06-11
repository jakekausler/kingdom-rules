import { saveMap } from "../utils/fetch";
import { HexWithLines } from "../types";
import { OnSelectPointFromModeArgs } from "../types";

export const onSelectPointEditRoads = ({
  position,
  map,
  setMap,
  clickType,
}: OnSelectPointFromModeArgs) => {
  if (clickType !== "left") {
    return;
  }
  const hexWithLine: HexWithLines = map.roads.find((h) => h.hex.x === position.hex.x && h.hex.y === position.hex.y) || {
    w: false,
    nw: false,
    sw: false,
    e: false,
    se: false,
    ne: false,
    hex: position.hex,
    useCenter: false,
  };
  if (hexWithLine[position.sextant.direction as 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se']) {
    hexWithLine[position.sextant.direction as 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se'] = false;
  } else {
    hexWithLine[position.sextant.direction as 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se'] = true;
  }
  map.roads = map.roads.filter((h) => h.hex.x !== position.hex.x || h.hex.y !== position.hex.y);
  map.roads.push({
    ...hexWithLine,
  });
  saveMap(map, setMap);
}