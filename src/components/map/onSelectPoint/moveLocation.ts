import { saveMap } from "../utils/fetch";
import { OnSelectPointFromModeArgs } from "../types";
import { Location } from "../types";

export const onSelectPointMoveLocation = ({
  position,
  map,
  setMap,
  clickType,
  locationId,
  doneWithMoveLocation,
}: OnSelectPointFromModeArgs) => {
  if (!locationId) {
    return;
  }
  if (clickType !== "left") {
    return;
  }
  const location = map.locations.find((l) => l.id === locationId) as Location;
  if (!location) {
    return;
  }
  location.location = position;
  saveMap(map, setMap);
  doneWithMoveLocation?.();
}