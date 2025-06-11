import { SettlementLocation } from "../types";

export const radiusFromSettlement = (settlement: SettlementLocation) => {
  if (settlement.size === "village" && !settlement.isCapital) {
    return 0;
  }
  if (
    settlement.size === "town" ||
    (settlement.size === "village" && settlement.isCapital)
  ) {
    return 1;
  }
  if (settlement.size === "city") {
    return 2;
  }
  if (settlement.size === "metropolis") {
    return 3;
  }
  return 0;
};