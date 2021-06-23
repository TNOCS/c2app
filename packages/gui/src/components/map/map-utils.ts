import m from 'mithril';
import mapboxgl, { GeoJSONSource, LinePaint, MapboxGeoJSONFeature } from 'mapbox-gl';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Point, Feature, Polygon, FeatureCollection, Geometry } from 'geojson';
import { IActions, IAppModel, ILayer, ISource, SourceType } from '../../services/meiosis';
import SquareGrid from '@turf/square-grid';
import polylabel from 'polylabel';
// @ts-ignore
import car from '../../assets/Operations/Car.png';
// @ts-ignore
import controlPoint from '../../assets/Operations/Control point.png';
// @ts-ignore
import divisionCommand from '../../assets/Operations/Division command.png';
// @ts-ignore
import evacuation from '../../assets/Operations/Evacuation.png';
// @ts-ignore
import fireman from '../../assets/Operations/Firemen unit.png';
// @ts-ignore
import helicopter from '../../assets/Operations/Helicopter.png';
// @ts-ignore
import media from '../../assets/Operations/Media.png';
// @ts-ignore
import medical from '../../assets/Operations/Medical services.png';
// @ts-ignore
import military from '../../assets/Operations/Military.png';
// @ts-ignore
import police from '../../assets/Operations/Police unit.png';
// @ts-ignore
import roadBlock from '../../assets/Operations/Road block.png';
// @ts-ignore
import truck from '../../assets/Operations/Truck.png';
// @ts-ignore
import chemical from '../../assets/Incidents/Chemical.png';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
    point: true,
  },
};

export const handleDrawEvent = (map: mapboxgl.Map, features: MapboxGeoJSONFeature[], actions: IActions) => {
  actions.updateDrawings(features[0] as MapboxGeoJSONFeature);
  if (features[0].geometry.type === 'Polygon') {
    getFeaturesInPolygon(map, features, actions);
  }

  const elem = document.getElementById('layerSelect') as HTMLElement;
  M.FormSelect.init(elem);
  const instance = M.Modal.getInstance(document.getElementById('createPOIModal') as HTMLElement);
  instance.open();
};

const getFeaturesInPolygon = (map: mapboxgl.Map, features: Feature[], actions: IActions) => {
  if (!map.getLayer('PositionsFiremen')) return;

  const bounding = bbox(features[0]);
  let bboxFeatures = map.queryRenderedFeatures(
    [map.project([bounding[0], bounding[1]]), map.project([bounding[2], bounding[3]])],
    { layers: ['PositionsFiremen'] },
  );
  const polyFeatures = bboxFeatures.filter((element) =>
    booleanPointInPolygon(
      [(element.geometry as Point).coordinates[0], (element.geometry as Point).coordinates[1]],
      features[0] as Feature<Polygon>,
    ),
  );
  actions.updateSelectedFeatures(polyFeatures);
};

export const displayInfoSidebar = (features: MapboxGeoJSONFeature[], actions: IActions) => {
  actions.updateClickedFeature(features[0] as MapboxGeoJSONFeature);
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
  map.loadImage(chemical, function(error, image) {
    if (error) throw error;
    if (!map.hasImage('chemical')) map.addImage('chemical', image as ImageBitmap);
  });
  map.loadImage(roadBlock, function(error, image) {
    if (error) throw error;
    if (!map.hasImage('roadBlock')) map.addImage('roadBlock', image as ImageBitmap);
  });
};

export const switchBasemap = async (map: mapboxgl.Map, styleID: string) => {
  const currentStyle = map.getStyle();
  const newStyle = await m.request(
    `https://api.mapbox.com/styles/v1/${styleID}?access_token=` + process.env.ACCESSTOKEN,
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

export const updateSourcesAndLayers = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  appState.app.sources.forEach((source: ISource) => {
    // Set source
    if (!map.getSource(source.sourceName)) {
      map.addSource(source.sourceName, {
        type: 'geojson',
        data: source.source,
      });
    } else {
      (map.getSource(source.sourceName) as GeoJSONSource).setData(source.source);
    }

    // Set Layers
    source.layers.forEach((layer: ILayer) => {
      const layerName = source.sourceName.concat(layer.layerName);

      if (!map.getLayer(layerName)) {
        map.addLayer({
          id: layerName,
          type: layer.type.type,
          source: source.sourceName,
          layout: layer.layout ? layer.layout : {},
          // @ts-ignore
          paint: layer.paint ? layer.paint : {},
          filter: layer.filter ? layer.filter : ['all'],
        });
        map.on('click', layerName, ({ features}) => displayInfoSidebar(features as MapboxGeoJSONFeature[], actions));
        map.on('mouseenter', layerName, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', layerName, () => (map.getCanvas().style.cursor = ''));
      }
      map.setLayoutProperty(layerName, 'visibility', layer.showLayer ? 'visible' : 'none');
      if(source.sourceCategory === SourceType.alert || source.sourceCategory === SourceType.cht) map.setPaintProperty(layerName, 'line-opacity', (layer.paint as LinePaint)['line-opacity'])
    });
  });
};

export const updateGrid = (appState: IAppModel, actions: IActions, map: mapboxgl.Map) => {
  const gridSource = getGridSource(map, actions, appState);
  const gridLabelsSource = getLabelsSource(gridSource);

  actions.updateGrid(gridSource, gridLabelsSource);
}

