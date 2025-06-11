import { useEffect } from 'react';
import L from 'leaflet';
import '@elfalem/leaflet-curve';
import { useLeafletContext } from '@react-leaflet/core';

interface CurveProps {
  path: (string | [number, number])[];
  options?: L.PathOptions;
}

const Curve: React.FC<CurveProps> = ({ path, options }) => {
  const context = useLeafletContext();

  useEffect(() => {
    const curve = (L as any).curve(path, options);
    const container = context.layerContainer || context.map;
    container.addLayer(curve);

    return () => {
      container.removeLayer(curve);
    };
  }, [path, options, context]);

  return null;
};

export default Curve;