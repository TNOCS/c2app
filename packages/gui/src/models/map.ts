import { MapboxStyleDefinition } from 'mapbox-gl-style-switcher';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon } from 'geojson';
import { IActions } from '../services';

// Mapbox settings
export const mapConfig = {
  container: 'mapboxMap',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [5.48, 51.44] as [number, number],
  zoom: 12,
};

// Define styles
export const mapStyles: MapboxStyleDefinition[] = [
  {
    title: 'Mapbox',
    uri: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    title: 'Here',
    uri:
      'https://assets.vector.hereapi.com/styles/berlin/base/mapbox/tilezen?apikey=931nNYHFAJN7xzv38O3wmat3R0fZ8XEVMFp9iiYb6Xs',
  },
];

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
};

export const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature<Polygon>[], actions: IActions) => {
  if (!map.getLayer('geojson_fr')) return;
  
  const bounding = bbox(features[0]);
  let bboxFeatures = map.queryRenderedFeatures(
    [map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])],
    { layers: ['geojson_fr'] }
  );
  const polyFeatures = bboxFeatures.filter((element) =>
    booleanPointInPolygon(
      [(element.geometry as Point).coordinates[0], (element.geometry as Point).coordinates[1]],
      features[0]
    )
  );
  actions.updateSelectedFeatures(polyFeatures);
};

export const displayPopup = (features: Feature[], actions: IActions) => {
  actions.updateClickedFeature(features[0]);
};
