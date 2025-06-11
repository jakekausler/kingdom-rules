import { Coordinate, Map, SettlementLocation } from "../types";
import { radiusFromSettlement } from "../utils/mapUtils";
import { getHexRingAxial } from "../utils/hexagons";
import { splitIntoContiguousHexGroups } from "../utils/hexagons";

export const displayInfluenceHexes = (
  map: Map,
  settlementId: string,
  recolorExtraInfluenceHexes: boolean,
  setInfluenceHexGroups: React.Dispatch<React.SetStateAction<Coordinate[][]>>,
  setExtraInfluenceHexGroups: React.Dispatch<React.SetStateAction<Coordinate[][]>>,
) => {
  if (!map) {
    return;
  }
  const settlement = map?.locations.find(
    (l) => l.id === settlementId && l.type === "settlement",
  ) as SettlementLocation;
  if (!settlement) {
    return;
  }
  const influenceHexes: Coordinate[] = [settlement.location.hex];
  const radius = radiusFromSettlement(settlement);
  for (let i = 1; i <= radius; i++) {
    influenceHexes.push(
      ...getHexRingAxial(
        settlement.location.hex,
        i,
        map.hexOrientation,
        map.hexLayout,
      ),
    );
  }
  if (recolorExtraInfluenceHexes) {
    const influenceGroups = splitIntoContiguousHexGroups(
      influenceHexes,
      map.hexOrientation,
      map.hexLayout,
    );
    setInfluenceHexGroups(influenceGroups);
    const extraInfluenceHexes = settlement.extraInfluenceHexes.map((h) => [
      h,
    ]);
    setExtraInfluenceHexGroups(extraInfluenceHexes);
  } else {
    influenceHexes.push(...settlement.extraInfluenceHexes);
    setInfluenceHexGroups(
      splitIntoContiguousHexGroups(
        influenceHexes,
        map.hexOrientation,
        map.hexLayout,
      ),
    );
  }
};