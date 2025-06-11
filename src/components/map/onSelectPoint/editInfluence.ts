import { saveMap } from "../utils/fetch";

import { distanceBetweenHexes } from "../utils/hexagons";
import { radiusFromSettlement } from "../utils/mapUtils";
import { OnSelectPointFromModeArgs, SettlementLocation } from "../types";

export const onSelectPointEditInfluence = ({ position, map, setMap, clickType, locationId }: OnSelectPointFromModeArgs) => {
  if (!locationId) {
    return;
  }
  if (clickType !== "left") {
    return;
  }
  const settlement = map.locations.find(
    (l) => l.type === "settlement" && l.id === locationId,
  ) as SettlementLocation;
  if (!settlement) {
    return;
  }
  const hex = position.hex;
  const radius = radiusFromSettlement(settlement);
  const distance = distanceBetweenHexes(
    settlement.location.hex,
    hex,
    map.hexOrientation,
    map.hexLayout,
  );
  const hexIndex = settlement.extraInfluenceHexes.findIndex(
    (h) => h.x === hex.x && h.y === hex.y,
  );
  if (hexIndex !== -1) {
    settlement.extraInfluenceHexes.splice(hexIndex, 1);
    saveMap({ ...map, locations: map.locations }, setMap);
  } else if (distance > radius) {
    settlement.extraInfluenceHexes.push(hex);
    saveMap({ ...map, locations: map.locations }, setMap);
  }
}