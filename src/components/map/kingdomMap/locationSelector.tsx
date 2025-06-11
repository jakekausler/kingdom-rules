import { useMapEvents } from "react-leaflet";
import { Coordinate } from "../types";

export const LocationSelector = ({
  onClick,
  onRightClick,
  onHover,
}: {
  onClick: (position: Coordinate) => void;
  onRightClick: (position: Coordinate) => void;
  onHover: (position: Coordinate) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick({
        y: e.latlng.lat,
        x: e.latlng.lng,
      });
    },
    contextmenu(e) {
      onRightClick({
        y: e.latlng.lat,
        x: e.latlng.lng,
      });
    },
    mousemove(e) {
      onHover({
        y: e.latlng.lat,
        x: e.latlng.lng,
      });
    },
  });

  return <></>;
}