import { axialToCube } from "../utils/hexagons";
import { OnSelectPointFromModeArgs } from "../types";

export const onSelectPointView = ({ position }: OnSelectPointFromModeArgs) => {
  console.log(axialToCube(position.hex), position.latlng);
};