import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon } from 'geojson';
import { IActions } from '../services/meiosis';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
    point: true,
  },
};

export const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature<Polygon>[], actions: IActions) => {
  if (!map.getLayer('geojson_fr')) return;

  const bounding = bbox(features[0]);
  let bboxFeatures = map.queryRenderedFeatures(
    [map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])],
    { layers: ['geojson_fr'] },
  );
  const polyFeatures = bboxFeatures.filter((element) =>
    booleanPointInPolygon(
      [(element.geometry as Point).coordinates[0], (element.geometry as Point).coordinates[1]],
      features[0],
    ),
  );
  actions.updateSelectedFeatures(polyFeatures);
};

export const displayPopup = (features: Feature[], actions: IActions) => {
  actions.updateClickedFeature(features[0]);
};
