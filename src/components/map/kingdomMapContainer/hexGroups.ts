import { Coordinate, HexOptions, Map } from "../types";
import { splitIntoContiguousHexGroups } from "../utils/hexagons";
import {
  influenceHexesOptions,
  extraInfluenceHexesOptions,
  ownedHexesOptions,
  reconnoiteredHexesOptions,
} from "./mapOptions";

export const updateHexGroups = (
  map: Map,
  setHexGroups: React.Dispatch<React.SetStateAction<Coordinate[][]>>,
  setHexGroupOptions: React.Dispatch<React.SetStateAction<HexOptions[]>>,
  ownedHexes: Coordinate[],
  reconnoiteredHexes: Coordinate[],
  influenceHexGroups: Coordinate[][],
  extraInfluenceHexGroups: Coordinate[][],
) => {
  const reconGroups = splitIntoContiguousHexGroups(
    reconnoiteredHexes,
    map.hexOrientation,
    map.hexLayout,
  );
  const ownedGroups = splitIntoContiguousHexGroups(
    ownedHexes,
    map.hexOrientation,
    map.hexLayout,
  );
  const nations = map.nations.map((nation) => ({
    hexGroups: splitIntoContiguousHexGroups(
      nation.hexes,
      map.hexOrientation,
      map.hexLayout,
    ),
    hexOptions: {
      outline: {
        color: nation.color,
        opacity: 0.5,
        thickness: 1,
      },
      fill: {
        color: nation.color,
        opacity: 0.2,
      },
    } as HexOptions,
  }));

  const allGroups = [
    ...reconGroups,
    ...ownedGroups,
    ...influenceHexGroups,
    ...extraInfluenceHexGroups,
    ...nations.flatMap((nation) => nation.hexGroups),
  ];

  const allOptions = [
    ...reconGroups.map(() => reconnoiteredHexesOptions),
    ...ownedGroups.map(() => ownedHexesOptions),
    ...influenceHexGroups.map(() => influenceHexesOptions),
    ...extraInfluenceHexGroups.map(() => extraInfluenceHexesOptions),
    ...nations.flatMap((nation) =>
      nation.hexGroups.map(() => nation.hexOptions),
    ),
  ];

  setHexGroups(allGroups);
  setHexGroupOptions(allOptions);
};

