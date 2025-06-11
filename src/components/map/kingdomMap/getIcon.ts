import { divIcon } from "leaflet";
import { Location, Map } from "../types";

export const getIcon = (location: Location, map: Map | null) => {
  if (!map) return undefined;
  const icon = location.icon || undefined;
  if (!icon) return undefined;
  return divIcon({
    className: "map-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<img width="100%" height="100%" src="${icon}" />`,
  });
};