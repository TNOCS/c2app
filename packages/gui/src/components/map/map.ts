import m from 'mithril';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
// @ts-ignore
import { RulerControl } from 'mapbox-gl-controls';
import { MeiosisComponent } from '../../services/meiosis';
import * as MapUtils from './map-utils';

export const Map: MeiosisComponent = () => {
  mapboxgl.accessToken = process.env.ACCESSTOKEN || '';
  let map: mapboxgl.Map;
  let draw: MapboxDraw;
  let token: boolean = process.env.ACCESSTOKEN ? true : false;

  return {
    view: () => {
      return m('#mapboxMap.col.s12.l9.right');
    },
    // Executes once on creation
    oncreate: ({ attrs: { state: appState, actions } }) => {
      // Create map and add controls
      map = new mapboxgl.Map({
        container: 'mapboxMap',
        style: token
          ? `mapbox://styles/${appState.app.mapStyle}`
          : {
            'version': 8,
            'sources': {
              'brt-achtergrondkaart': {
                'type': 'raster',
                'tiles': ['https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png'],
                'tileSize': 256,
                'minzoom': 1,
                'maxzoom': 19,
                'attribution': 'Kaartgegevens: <a href="https://kadaster.nl">Kadaster</a>'
              },
            },
            'glyphs': 'https://api.pdok.nl/lv/bgt/ogc/v1_0/resources/fonts/{fontstack}/{range}.pbf',
            'layers': [
              {
                'id': 'standard-raster',
                'type': 'raster',
                'source': 'brt-achtergrondkaart',
              }
            ]
          },
        center: [4.35, 51.911] as [number, number],
        zoom: 12,
      });
      MapUtils.loadImages(map);
      MapUtils.updateGrid(appState, actions, map);

      // Add draw controls
      draw = new MapboxDraw(MapUtils.drawConfig);
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(draw, 'top-left');
      map.addControl(new RulerControl(), 'top-left');

      // Add map listeners
      map.on('load', () => {
        map.on('draw.create', ({ features }) => MapUtils.handleDrawEvent(map, features, actions));
        map.on('draw.update', ({ features }) => MapUtils.handleDrawEvent(map, features, actions));

        map.once('styledata', () => {
          MapUtils.updateSourcesAndLayers(appState, actions, map);
          MapUtils.updateSatellite(appState, map);
        });
      });
    },
    // Executes on every redraw
    onupdate: ({ attrs: { state: appState, actions } }) => {
      if (!map.loaded()) return;
      // Check if drawings should be removed from the map
      if (appState.app.clearDrawing.delete) {
        draw.delete(appState.app.clearDrawing.id);
        actions.drawingCleared();
      }

      // Update the grid if necessary
      if (appState.app.gridOptions.updateGrid) {
        MapUtils.updateGrid(appState, actions, map);
      }

      // Check if basemap should be switched
      if (token && !map.getStyle().sprite?.includes(appState.app.mapStyle)) {
        MapUtils.switchBasemap(map, appState.app.mapStyle).catch();
      }

      MapUtils.updateSourcesAndLayers(appState, actions, map);
      MapUtils.updateSatellite(appState, map);
    },
  };
};
