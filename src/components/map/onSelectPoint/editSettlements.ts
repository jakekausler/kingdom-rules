import { saveMap } from "../utils/fetch";
import { OnSelectPointFromModeArgs, SettlementLocation } from "../types";
import { v4 as uuidv4 } from "uuid";

export const onSelectPointEditSettlements = ({ position, map, setMap, clickType }: OnSelectPointFromModeArgs) => {
  if (clickType !== "left") {
    return;
  }
  const newSettlement: SettlementLocation = {
    id: uuidv4(),
    type: "settlement",
    name: "New Settlement",
    description: "",
    location: position,
    size: "village",
    icon: "/mapicons/042.png",
    hidden: false,
    extraInfluenceHexes: [],
    isCapital: false,
  };
  map.locations.push(newSettlement);
  saveMap(map, setMap);
}