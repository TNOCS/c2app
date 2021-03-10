import { MapboxStyleDefinition } from 'mapbox-gl-style-switcher';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon } from 'geojson';

// Mapbox settings
export const mapConfig = {
  container: 'mapboxMap',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.48, 51.9] as [number, number],
  zoom: 9,
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

export const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature<Polygon>[]) => {
  if (map.getLayer('geojson_fr')) {
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
    console.log(polyFeatures);
  }
};

export const displayPopup = (map: mapboxgl.Map, features: Feature[]) => {
  const coordinates = (features[0].geometry as Point).coordinates.slice() as [number, number];
  const props = features[0].properties;
  const description = `<strong>${props?.type}</strong><p>${props?.tags + props?.id}</p>`;
  new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
};
