import { saveMap } from "../utils/fetch";
import { OnSelectPointFromModeArgs, POILocation } from "../types";
import { v4 as uuidv4 } from "uuid";

export const onSelectPointEditPOIs = ({ position, map, setMap, clickType }: OnSelectPointFromModeArgs) => {
  if (clickType !== "left") {
    return;
  }
  const newPOI: POILocation = {
    id: uuidv4(),
    type: "poi",
    name: "New POI",
    description: "",
    icon: "/mapicons/017.png",
    location: position,
    hidden: false,
  };
  map.locations.push(newPOI);
  saveMap(map, setMap);
}