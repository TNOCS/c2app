import m from 'mithril';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon, FeatureCollection, Geometry, Position } from 'geojson';
import { IActions, IAppModel } from '../services/meiosis';
import SquareGrid from '@turf/square-grid';
import polylabel from 'polylabel';
// @ts-ignore
import car from 'url:../assets/car_icon.png';
// @ts-ignore
import fireman from 'url:../assets/fireman_icon.png';
import { IAlert, IArea, IInfo } from '../types';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
    point: true,
  },
};

export const handleDrawEvent = (map: mapboxgl.Map, features: Feature[], actions: IActions) => {
  if (features[0].geometry.type === 'Polygon') {
    getFeaturesInPolygon(map, features, actions);
  } else if (features[0].geometry.type === 'Point') {
    actions.updateClickedFeature(features[0]);
  }
};

const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature[], actions: IActions) => {
  if (!map.getLayer('firemenPositions')) return;

  const bounding = bbox(features[0]);
  let bboxFeatures = map.queryRenderedFeatures(
    [map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])],
    { layers: ['firemenPositions'] },
  );
  const polyFeatures = bboxFeatures.filter((element) =>
    booleanPointInPolygon(
      [(element.geometry as Point).coordinates[0], (element.geometry as Point).coordinates[1]],
      features[0] as Feature<Polygon>,
    ),
  );
  actions.updateSelectedFeatures(polyFeatures);
};

export const displayPopup = (features: Feature[], actions: IActions) => {
  actions.updateClickedFeature(features[0]);
};

export const getGridSource = (map: mapboxgl.Map, actions: IActions, appState: IAppModel): FeatureCollection<Polygon> => {
  if (appState.app.gridOptions.updateLocation) {
    const bounds = map.getBounds();
    actions.updateGridLocation([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
    appState.app.gridOptions.gridLocation = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  }

  return SquareGrid(appState.app.gridOptions.gridLocation, appState.app.gridOptions.gridCellSize, { units: 'kilometers' });
};

const getRowLetter = (index: number, rows: number) => {
  return String.fromCharCode(Math.abs((index % rows) - rows) + 64);
};

const getColumnNumber = (index: number, rows: number) => {
  return Math.floor(index / rows) + 1;
};

export const getLabelsSource = (gridSource: FeatureCollection<Polygon>): FeatureCollection => {
  let rows = new Set<number>();
  let prev_size: number = 0;
  gridSource.features.some((feature: Feature) => {
    let longLat = polylabel((feature.geometry as Polygon).coordinates);
    rows.add(longLat[1]);
    const curr_size = rows.size;
    if (prev_size === curr_size) return true;
    prev_size = curr_size;
    return false;
  });

  return {
    type: 'FeatureCollection',
    features:
      gridSource.features.map((feature: Feature, index: number) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: polylabel((feature.geometry as Polygon).coordinates),
          } as Geometry,
          properties: {
            cellLabel: `${getRowLetter(index, rows.size) + getColumnNumber(index, rows.size)}`,
          },
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

// TODO: Fix this (depends on how CAP is going to work)
export const prepareGeoJSON = (alertMessage: IAlert): FeatureCollection => {
  const alertInfo = alertMessage.info as IInfo;
  const alertArea = alertInfo.area as IArea[];

  let featureCollection: FeatureCollection;
  if (alertArea[0].areaDesc.includes('polygon')) {
    featureCollection = {
      type: 'FeatureCollection',
      features:
        [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                (alertArea[0].polygon as string[]).map((coordinate: string) => {
                  let splitCoords = coordinate.split(', ');
                  return [Number(splitCoords[0]), Number(splitCoords[1])];
                }) as Position[],
              ],
            },
            properties: {},
          } as Feature<Polygon>,
        ],
    } as FeatureCollection;
  } else {
    featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [[5.477628707885741, 51.443763428806044],
                [5.4743242263793945, 51.44181075517023],
                [5.477542877197266, 51.43921597746186],
                [5.477628707885741, 51.443763428806044]],
            ],
          },
          properties: {},
        } as Feature<Polygon>,
      ],
    } as FeatureCollection;
  }
  return featureCollection;
};
