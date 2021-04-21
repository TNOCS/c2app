import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon, FeatureCollection, Geometry } from 'geojson';
import { IActions, IAppModel } from '../services/meiosis';
import SquareGrid from '@turf/square-grid';
import polylabel from 'polylabel';
// @ts-ignore
import car from 'url:../assets/car_icon.png';
// @ts-ignore
import fireman from 'url:../assets/fireman_icon.png';
import m from 'mithril';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
    point: true,
  },
};

export const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature<Polygon>[], actions: IActions) => {
  if (!map.getLayer('firemenPositions')) return;

  const bounding = bbox(features[0]);
  let bboxFeatures = map.queryRenderedFeatures(
    [map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])],
    { layers: ['firemenPositions'] },
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

export const getGridSource = (appState: IAppModel): FeatureCollection<Polygon> => {
  return SquareGrid(appState.app.gridLocation, appState.app.gridCellSize, { units: 'kilometers' });
};

export const getLabelsSource = (gridSource: FeatureCollection<Polygon>): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features:
      gridSource.features.map((feature: Feature) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: polylabel((feature.geometry as Polygon).coordinates),
          } as Geometry,
          properties: {},
        } as Feature;
      }),
  } as FeatureCollection;
};

export const loadImages = (map: mapboxgl.Map) => {
  map.loadImage(fireman, function(error, image) {
    if (error) throw error;
    if (!map.hasImage('fireman')) map.addImage('fireman', image as ImageBitmap);
  });
  map.loadImage(car, function(error, image) {
    if (error) throw error;
    if (!map.hasImage('car')) map.addImage('car', image as ImageBitmap);
  });
};

export const switchBasemap = async (map: mapboxgl.Map, styleID: string) => {
  const currentStyle = map.getStyle();
  const newStyle = await m.request(
    `https://api.mapbox.com/styles/v1/${styleID}?access_token=pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ`,
  ) as mapboxgl.Style;

  // ensure any sources from the current style are copied across to the new style
  newStyle.sources = Object.assign(
    {},
    currentStyle.sources,
    newStyle.sources,
  );

  // find the index of where to insert our layers to retain in the new style
  let labelIndex = newStyle.layers?.findIndex((el) => {
    return el.id == 'state-label';
  });

  // default to on top
  if (labelIndex === -1) {
    labelIndex = newStyle.layers?.length;
  }
  const appLayers = currentStyle.layers?.filter((el) => {
    // app layers are the layers to retain, and these are any layers which have a different source set
    return (
      // @ts-ignore
      el.source &&
      // @ts-ignore
      el.source != 'mapbox://mapbox.satellite' &&
      // @ts-ignore
      el.source != 'mapbox' &&
      // @ts-ignore
      el.source != 'composite'
    );
  });

  newStyle.layers = [
    // @ts-ignore
    ...newStyle.layers.slice(0, labelIndex),
    // @ts-ignore
    ...appLayers,
    // @ts-ignore
    ...newStyle.layers.slice(labelIndex, -1),
  ];

  map.setStyle(newStyle);
  loadImages(map);
};
