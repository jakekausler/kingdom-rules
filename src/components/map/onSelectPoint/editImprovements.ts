import { saveMap } from "../utils/fetch";
import { OnSelectPointFromModeArgs, ImprovementLocation } from "../types";
import { v4 as uuidv4 } from "uuid";

export const onSelectPointEditImprovements = ({ position, map, setMap, clickType }: OnSelectPointFromModeArgs) => {
  if (clickType !== "left") {
    return;
  }
  const newImprovement: ImprovementLocation = {
    id: uuidv4(),
    type: "improvement",
    name: "New Improvement",
    description: "",
    icon: "/mapicons/C_043.png",
    location: position,
    hidden: false,
    connectedSettlement: "",
    improvement: "Farm",
  };
  map.locations.push(newImprovement);
  saveMap(map, setMap);
}