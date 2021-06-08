import m, { FactoryComponent } from 'mithril';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
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

  return {
    view: () => {
      return m('#mapboxMap.col.s12.l9.right');
    },
    // Executes once on creation
    oncreate: ({ attrs: { state: appState, actions } }) => {
      // Create map and add controls
      map = new mapboxgl.Map({
        container: 'mapboxMap',
        style: `mapbox://styles/${appState.app.mapStyle}`,
        center: [5.48, 51.44] as [number, number],
        zoom: 12,
      });

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
          MapUtils.initRealtimeLayers(appState, actions, map);
          MapUtils.initGridLayers(appState, actions, map);
          MapUtils.customLayersUpdate(appState, actions, map);
          MapUtils.alertLayersUpdate(appState, actions, map);
          MapUtils.CHTLayersUpdate(appState, actions, map);
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
        const gridSource = MapUtils.getGridSource(map, actions, appState);
        const gridLabelsSource = MapUtils.getLabelsSource(gridSource);

        (map.getSource('gridSource') as GeoJSONSource).setData(gridSource);
        (map.getSource('gridLabelsSource') as GeoJSONSource).setData(gridLabelsSource);

        actions.updateGridDone();
      }

      // Set new positionSource
      (map.getSource('positionSource') as GeoJSONSource).setData(appState.app.positionSource);

      // Check if basemap should be switched
      if (!map.getStyle().sprite?.includes(appState.app.mapStyle)) {
        MapUtils.switchBasemap(map, appState.app.mapStyle).catch();
      }

      // Toggle visibility of realtime layers
      appState.app.realtimeLayers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      // Toggle visibility of grid layers
      appState.app.gridLayers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      // Update custom layers
      MapUtils.customLayersUpdate(appState, actions, map);
      // Update alert layers
      MapUtils.alertLayersUpdate(appState, actions, map);
      // Update CHT layers
      MapUtils.CHTLayersUpdate(appState, actions, map);
    },
  };
};
