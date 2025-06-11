import { getHexCenter } from './hexagons';
import { Coordinate, Map, Position } from '../types';

/**
 * Get the new location of a point based on the original bounds and the new bounds
 * @param point the original point within the original bounds
 * @param originalBounds the original bounds
 * @param newBounds the new bounds
 * @returns the new point within the new bounds
 */
export const scalePoint = (
  point: Coordinate,
  originalBounds: Coordinate,
  newBounds: Coordinate,
): Coordinate => {
  return {
    x: (originalBounds.x - point.x) * (newBounds.x / originalBounds.x),
    y: (originalBounds.y - point.y) * (newBounds.y / originalBounds.y),
  };
};

export const mapPointToLatlng = (point: Coordinate, map: Map | null): Coordinate => {
  if (!map) {
    throw new Error("No map");
  }
  const l = scalePoint(
    {
      x: map.imageSize.x + point.x + map.mapOffset.x,
      y: map.imageSize.y + point.y + map.mapOffset.y,
    },
    map.imageSize,
    { x: 256, y: 256 },
  );
  return {
    y: l.y,
    x: -l.x,
  };
};

export const latlngToMapPoint = (latlng: Coordinate, map: Map | null) => {
  if (!map) {
    throw new Error("No map");
  }
  const p = scalePoint(
    { x: latlng.x, y: -latlng.y },
    {
      x: 256,
      y: 256,
    },
    map.imageSize,
  );
  p.x = map.imageSize.x - p.x - map.mapOffset.x;
  p.y = map.imageSize.y - p.y - map.mapOffset.y;
  return p;
};

export const getMapBounds = (map: Map | null) => {
  if (!map) {
    return [
      [0, 0],
      [-256, 256],
    ];
  }
  return [
    [
      -(map.mapOffset.y * 256) / map.imageSize.y,
      (map.mapOffset.x * 256) / map.imageSize.x,
    ],
    [
      -((map.mapOffset.y + map.mapSize.y) * 256) / map.imageSize.y,
      ((map.mapOffset.x + map.mapSize.x) * 256) / map.imageSize.x,
    ],
  ];
};

export const getMapCenter = (initialPosition: Position | null, map: Map | null) => {
  if (!map) {
    return {
      x: 128,
      y: -128,
    };
  }
  return initialPosition?.latlng ||
    (initialPosition?.coordinate &&
      mapPointToLatlng(initialPosition?.coordinate, map)) ||
    (initialPosition?.hex &&
      mapPointToLatlng(
        getHexCenter(
          initialPosition?.hex,
          map.hexOffset,
          map.hexApothem,
          map.hexOrientation,
          map.hexLayout,
        ),
        map,
      )) || {
    x: 128,
    y: -128,
  }
};