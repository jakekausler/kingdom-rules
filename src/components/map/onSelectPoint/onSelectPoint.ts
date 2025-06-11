import { MODE } from "../kingdomMapContainer/mapMode";
import { OnSelectPointFromModeArgs } from "../types";
import { onSelectPointView } from "./view";
import { onSelectPointEditBorders } from "./editBorders";
import { onSelectPointEditSettlements } from "./editSettlements";
import { onSelectPointEditInfluence } from "./editInfluence";
import { onSelectPointEditImprovements } from "./editImprovements";
import { onSelectPointEditRoads } from "./editRoads";
import { onSelectPointEditWaterways } from "./editWaterways";
import { onSelectPointEditPOIs } from "./editPOIs";
import { onSelectPointMoveLocation } from "./moveLocation";

export const onSelectPointFromMode: Record<
  MODE,
  (args: OnSelectPointFromModeArgs) => void
> = {
  view: onSelectPointView,
  editBorders: onSelectPointEditBorders,
  editSettlements: onSelectPointEditSettlements,
  editInfluence: onSelectPointEditInfluence,
  editImprovements: onSelectPointEditImprovements,
  editRoads: onSelectPointEditRoads,
  editWaterways: onSelectPointEditWaterways,
  editPOIs: onSelectPointEditPOIs,
  moveLocation: onSelectPointMoveLocation,
};