import m, { FactoryComponent } from 'mithril';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
// @ts-ignore
import { RulerControl } from 'mapbox-gl-controls';
import { IActions, IAppModel } from '../../services/meiosis';
import * as MapUtils from './map-utils';

export const Map: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
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
        style: token ? `mapbox://styles/${appState.app.mapStyle}` : 'https://geodata.nationaalgeoregister.nl/beta/topotiles-viewer/styles/achtergrond.json',
        center: [4.350, 51.911] as [number, number],
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
    },
  };
};
