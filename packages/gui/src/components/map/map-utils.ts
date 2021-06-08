import m from 'mithril';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon, FeatureCollection, Geometry } from 'geojson';
import { IActions, IAppModel } from '../../services/meiosis';
import SquareGrid from '@turf/square-grid';
import polylabel from 'polylabel';
// @ts-ignore
import car from '../../assets/car_icon.png';
// @ts-ignore
import fireman from '../../assets/fireman_icon.png';
import { IAlert, IArea, IInfo } from '../../../../shared/src';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
    point: true,
  },
};

export const enum ILayerType {
  'realtime',
  'grid',
  'custom',
  'alert',
  'cht'
}

export const handleDrawEvent = (map: mapboxgl.Map, features: Feature[], actions: IActions) => {
  actions.updateDrawings(features[0]);
  if (features[0].geometry.type === 'Polygon') {
    getFeaturesInPolygon(map, features, actions);
  } else if (features[0].geometry.type === 'Point') {
    actions.updateClickedFeature(features[0]);
  }
  const elem = document.getElementById('layerSelect') as HTMLElement;
  M.FormSelect.init(elem);
  const instance = M.Modal.getInstance(document.getElementById('createPOIModal') as HTMLElement);
  instance.open();
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

export const displayInfoSidebar = (features: Feature[], actions: IActions, type: ILayerType) => {
  console.log(type);
  actions.updateClickedFeature(features[0]);
  const instance = M.Sidenav.getInstance(document.getElementById('slide-out-2') as HTMLElement);
  instance.open();
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

export const prepareGeoJSON = (alertMessage: IAlert): FeatureCollection => {
  return JSON.parse(((alertMessage.info as IInfo).area as IArea[])[0].areaDesc) as FeatureCollection;
};

export const initRealtimeLayers = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  const positionSource = appState.app.positionSource;

  map.addSource('positionSource', {
    type: 'geojson',
    data: positionSource,
  });

  map.loadImage(fireman, function(error, image) {
    if (error) throw error;
    if (!map.hasImage('fireman')) map.addImage('fireman', image as ImageBitmap);
    map.addLayer({
      id: 'firemenPositions',
      type: 'symbol',
      source: 'positionSource',
      layout: {
        'visibility': appState.app.realtimeLayers[0][1] ? 'visible' : 'none',
        'icon-image': 'fireman',
        'icon-size': 0.5,
        'icon-allow-overlap': true,
      },
      filter: ['all', ['in', 'type', 'man', 'firefighter']],
    });
  });

  map.on('click', 'firemenPositions', ({ features }) => displayInfoSidebar(features as Feature[], actions, ILayerType.realtime));
  map.on('mouseenter', 'firemenPositions', () => (map.getCanvas().style.cursor = 'pointer'));
  map.on('mouseleave', 'firemenPositions', () => (map.getCanvas().style.cursor = ''));
};

export const initGridLayers = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  const gridSource = getGridSource(map, actions, appState);
  const gridLabelsSource = getLabelsSource(gridSource);

  map.addSource('gridSource', {
    type: 'geojson',
    data: gridSource,
  });
  map.addSource('gridLabelsSource', {
    type: 'geojson',
    data: gridLabelsSource,
  });

  map.addLayer({
    id: 'grid',
    type: 'line',
    source: 'gridSource',
    layout: {
      'visibility': appState.app.gridLayers[0][1] ? 'visible' : 'none',
    },
    paint: {
      'line-opacity': 0.5,
    },
  });
  map.addLayer({
    id: 'gridLabels',
    type: 'symbol',
    source: 'gridLabelsSource',
    layout: {
      'visibility': appState.app.gridLayers[1][1] ? 'visible' : 'none',
      'text-field': '{cellLabel}',
      'text-allow-overlap': true,
    },
    paint: {
      'text-opacity': 0.5,
    },
  });
  map.on('click', 'grid', ({ features }) => displayInfoSidebar(features as Feature[], actions, ILayerType.grid));
  map.on('mouseenter', 'grid', () => (map.getCanvas().style.cursor = 'pointer'));
  map.on('mouseleave', 'grid', () => (map.getCanvas().style.cursor = ''));
};

export const customLayersUpdate = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  // The forEach ensures we only update if there is actual data
  appState.app.customLayers.forEach((layer: [string, boolean], index: number) => {
    // For custom layers, first check if the source for this layer exists
    if (!map.getSource(layer[0] + 'Source')) {
      map.addSource(layer[0] + 'Source', {
        type: 'geojson',
        data: appState.app.customSources[index],
      });
    } else {
      (map.getSource(layer[0] + 'Source') as GeoJSONSource).setData(appState.app.customSources[index]);
    }
    // For custom layers, first check if the layer already exists
    if (!map.getLayer(layer[0])) {
      map.addLayer({
        id: layer[0],
        type: 'circle',
        source: layer[0] + 'Source',
        layout: {
          'visibility': layer[1] ? 'visible' : 'none',
        },
      });
      map.on('click', layer[0], ({ features }) => displayInfoSidebar(features as Feature[], actions, ILayerType.custom));
      map.on('mouseenter', layer[0], () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', layer[0], () => (map.getCanvas().style.cursor = ''));
    }
    map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
  });
};

export const alertLayersUpdate = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  // The forEach ensures we only update if there is actual data
  appState.app.alertLayers.forEach((layers: [string, Array<[string, boolean]>], index: number) => {
    // For custom layers, first check if the source for this layer exists
    if (!map.getSource(layers[0] + 'Source')) {
      map.addSource(layers[0] + 'Source', {
        type: 'geojson',
        data: prepareGeoJSON(appState.app.alerts[index] as IAlert),
      });
    } else {
      (map.getSource(layers[0] + 'Source') as GeoJSONSource).setData(prepareGeoJSON(appState.app.alerts[index] as IAlert));
    }
    // Loop through all DTs of all alerts
    layers[1].forEach((layer: [string, boolean]) => {
      if (!map.getLayer(layers[0] + layer[0])) {
        map.addLayer({
          id: layers[0] + layer[0],
          type: 'fill',
          source: layers[0] + 'Source',
          layout: {},
          paint: {
            'fill-color': {
              type: 'identity',
              property: 'color',
            },
            'fill-opacity': 0.5,
          },
          filter: ['all', ['in', 'deltaTime', Number(layer[0])]],
        });
        map.on('click', layers[0] + layer[0], ({ features }) => displayInfoSidebar(features as Feature[], actions, ILayerType.alert));
        map.on('mouseenter', layers[0] + layer[0], () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', layers[0] + layer[0], () => (map.getCanvas().style.cursor = ''));
      }
      map.setLayoutProperty(layers[0] + layer[0], 'visibility', layer[1] ? 'visible' : 'none');
    });
  });
};

export const CHTLayersUpdate = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  if (!appState.app.CHTSource.features) return;

  if (!map.getSource('CHTSource')) {
    map.addSource('CHTSource', {
      type: 'geojson',
      data: appState.app.CHTSource,
    });
  } else {
    (map.getSource('CHTSource') as GeoJSONSource).setData(appState.app.CHTSource);
  }
  // For custom layers, first check if the layer already exists
  appState.app.CHTLayers.forEach((layer: [string, boolean]) => {
    if (!map.getLayer(layer[0])) {
      map.addLayer({
        id: layer[0],
        type: 'fill',
        source: 'CHTSource',
        layout: {},
        paint: {
          'fill-color': {
            type: 'identity',
            property: 'color',
          },
          'fill-opacity': 0.5,
        },
        filter: ['all', ['in', 'deltaTime', Number(layer[0])]],
      });
      map.on('click', layer[0], ({ features }) => displayInfoSidebar(features as Feature[], actions, ILayerType.cht));
      map.on('mouseenter', layer[0], () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', layer[0], () => (map.getCanvas().style.cursor = ''));
    }
    map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
  });
};
