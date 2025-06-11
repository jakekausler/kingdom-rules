import { Location, Map, MarkerOptions } from "../types";

export const updateLocations = (markers: MarkerOptions, map: Map, setLocations: (locations: Location[]) => void) => {
  if (markers?.show && map) {
    setLocations(
      map.locations.filter(
        (l: Location) =>
          (markers.showHidden || !l.hidden) &&
          (!markers.showAllTypesExcept ||
            !markers.showAllTypesExcept.includes(l.type)) &&
          (!markers.hideAllTypesExcept ||
            markers.hideAllTypesExcept.includes(l.type)),
      ),
    );
  }
};