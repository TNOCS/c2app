import m, { FactoryComponent } from 'mithril';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
// @ts-ignore
import RulerControl from 'mapbox-gl-controls/lib/ruler';
import { Feature } from 'geojson';
import { IActions, IAppModel } from '../../services/meiosis';
import * as MapUtils from '../../models/map';

export const Mapbox: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ';
  let map: mapboxgl.Map;
  let draw: MapboxDraw;

  return {
    oninit: ({ attrs: { state: _appState, actions } }) => {
      actions.initGroups();
    },
    view: () => {
      return m('div.col.s12.l9.right', { id: 'mapboxMap' });
    },
    // Executes once on creation
    oncreate: ({ attrs: { state: appState, actions } }) => {
      // Create map and add controls
      map = new mapboxgl.Map({
        container: 'mapboxMap',
        style: appState.app.mapStyle,
        center: [5.48, 51.44] as [number, number],
        zoom: 12,
      });
      draw = new MapboxDraw(MapUtils.drawConfig);

      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(draw, 'top-left');
      map.addControl(new RulerControl(), 'top-left');

      // Add map listeners and socket listener
      map.on('load', () => {
        map.on('draw.create', ({ features }) => MapUtils.getFeaturesInPolygon(map, features, actions));
        map.on('draw.update', ({ features }) => MapUtils.getFeaturesInPolygon(map, features, actions));
        map.on('click', 'firemenPositions', ({ features }) => MapUtils.displayPopup(features as Feature[], actions));
        map.on('mouseenter', 'firemenPositions', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'firemenPositions', () => (map.getCanvas().style.cursor = ''));
        map.once('styledata', () => {
          const positionSource = appState.app.positionSource;
          const gridSource = MapUtils.getGridSource(appState);
          const gridLabelsSource = MapUtils.getLabelsSource(gridSource);
          console.log(gridSource)

          map.addSource('positions', {
            type: 'geojson',
            data: positionSource,
          });
          map.addSource('grid', {
            type: 'geojson',
            data: gridSource,
          });
          map.addSource('gridLabels', {
            type: 'geojson',
            data: gridLabelsSource,
          });

          MapUtils.loadImages(map);

          map.addLayer({
            id: 'firemenPositions',
            type: 'symbol',
            source: 'positions',
            layout: {
              'icon-image': 'fireman',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            },
            filter: ['all', ['in', 'type', 'man', 'firefighter']],
          });
          map.addLayer({
            id: 'carPositions',
            type: 'symbol',
            source: 'positions',
            layout: {
              'icon-image': 'car',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            },
            filter: ['==', 'type', 'car'],
          });
          map.addLayer({
            id: 'grid',
            type: 'line',
            source: 'grid',
            layout: {
              'visibility': appState.app.showGrid ? 'visible' : 'none',
            },
          });
          // TODO: make text-field change based on encoding type and amount of polygons
          map.addLayer({
            id: 'gridLabels',
            type: 'symbol',
            source: 'gridLabels',
            layout: {
              'visibility': appState.app.showGrid ? 'visible' : 'none',
              'text-field': 'AB',
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-anchor': 'center',
            },
          });
        });
      });
    },
    // Executes on every redraw
    onupdate: ({ attrs: { state: appState, actions } }) => {
      if (!map.loaded()) return;
      console.log('Update')

      if (appState.app.switchStyle) {
        MapUtils.switchBasemap(map, appState.app.mapStyle).then(() => {
          actions.styleSwitched();
        });
      }

      appState.app.layers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      const gridSource = MapUtils.getGridSource(appState);
      const gridLabelsSource = MapUtils.getLabelsSource(gridSource);

      (map.getSource('grid') as GeoJSONSource).setData(gridSource);
      (map.getSource('gridLabels') as GeoJSONSource).setData(gridLabelsSource);
      map.setLayoutProperty('grid', 'visibility', appState.app.showGrid ? 'visible' : 'none');
      map.setLayoutProperty('gridLabels', 'visibility', appState.app.showGrid ? 'visible' : 'none');

      if (appState.app.updateLocation) {
        const bounds = map.getBounds();
        actions.updateGridLocation([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
        //appState.app.gridLocation = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
      }

      (map.getSource('positions') as GeoJSONSource).setData(appState.app.positionSource);
    },
  };
};
