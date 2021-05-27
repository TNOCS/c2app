import m, { FactoryComponent } from 'mithril';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { RulerControl } from 'mapbox-gl-controls';
import { Feature } from 'geojson';
import { IActions, IAppModel } from '../../services/meiosis';
import { IAlert } from '../../../../shared/src';
import * as MapUtils from '../../models/map-utils';
// @ts-ignore
import fireman from 'url:../../assets/fireman_icon.png';
// @ts-ignore
import car from 'url:../../assets/car_icon.png';

export const Map: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ';
  let map: mapboxgl.Map;
  let draw: MapboxDraw;

  return {
    view: () => {
      return m('div.col.s12.l9.right', { id: 'mapboxMap' });
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
      draw = new MapboxDraw(MapUtils.drawConfig);

      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(draw, 'top-left');
      map.addControl(new RulerControl(), 'top-left');

      // Add map listeners
      map.on('load', () => {
        map.on('draw.create', ({ features }) => MapUtils.handleDrawEvent(map, features, actions));
        map.on('draw.update', ({ features }) => MapUtils.handleDrawEvent(map, features, actions));
        map.on('click', 'firemenPositions', ({ features }) => MapUtils.displayPopup(features as Feature[], actions));
        map.on('mouseenter', 'firemenPositions', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'firemenPositions', () => (map.getCanvas().style.cursor = ''));
        map.once('styledata', () => {
          const positionSource = appState.app.positionSource;
          const gridSource = MapUtils.getGridSource(map, actions, appState);
          const gridLabelsSource = MapUtils.getLabelsSource(gridSource);

          map.addSource('gridLabelsSource', {
            type: 'geojson',
            data: gridLabelsSource,
          });
          map.addSource('positionSource', {
            type: 'geojson',
            data: positionSource,
          });
          map.addSource('gridSource', {
            type: 'geojson',
            data: gridSource,
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
          map.loadImage(car, function(error, image) {
            if (error) throw error;
            if (!map.hasImage('car')) map.addImage('car', image as ImageBitmap);
            map.addLayer({
              id: 'carPositions',
              type: 'symbol',
              source: 'positionSource',
              layout: {
                'visibility': appState.app.realtimeLayers[1][1] ? 'visible' : 'none',
                'icon-image': 'car',
                'icon-size': 0.5,
                'icon-allow-overlap': true,
              },
              filter: ['==', 'type', 'car'],
            });
          });
          map.addLayer({
            id: 'grid',
            type: 'line',
            source: 'gridSource',
            layout: {
              'visibility': appState.app.gridLayers[0][1] ? 'visible' : 'none',
            },
          });
          map.addLayer({
            id: 'gridLabels',
            type: 'symbol',
            source: 'gridLabelsSource',
            layout: {
              'visibility': appState.app.gridLayers[1][1] ? 'visible' : 'none',
              'text-field': '{cellLabel}',
            },
          });
        });
      });
    },
    // Executes on every redraw
    onupdate: ({ attrs: { state: appState, actions } }) => {
      if (!map.loaded()) return;

      if (appState.app.clearDrawing.delete) {
        draw.delete(appState.app.clearDrawing.id);
        actions.drawingCleared();
      }

      if (appState.app.gridOptions.updateGrid) {
        const gridSource = MapUtils.getGridSource(map, actions, appState);
        const gridLabelsSource = MapUtils.getLabelsSource(gridSource);

        (map.getSource('gridSource') as GeoJSONSource).setData(gridSource);
        (map.getSource('gridLabelsSource') as GeoJSONSource).setData(gridLabelsSource);

        actions.updateGridDone();
      }

      (map.getSource('positionSource') as GeoJSONSource).setData(appState.app.positionSource);

      if (!map.getStyle().sprite?.includes(appState.app.mapStyle)) {
        MapUtils.switchBasemap(map, appState.app.mapStyle).catch();
      }

      appState.app.realtimeLayers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      appState.app.gridLayers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

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
        }
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      appState.app.alertLayers.forEach((layer: [string, boolean], index: number) => {
        // For custom layers, first check if the source for this layer exists
        if (!map.getSource(layer[0] + 'Source')) {
          map.addSource(layer[0] + 'Source', {
            type: 'geojson',
            data: MapUtils.prepareGeoJSON(appState.app.alerts[index] as IAlert),
          });
        } else {
          (map.getSource(layer[0] + 'Source') as GeoJSONSource).setData(MapUtils.prepareGeoJSON(appState.app.alerts[index] as IAlert));
        }
        // For custom layers, first check if the layer already exists
        if (!map.getLayer(layer[0])) {
          map.addLayer({
            id: layer[0],
            type: 'fill',
            source: layer[0] + 'Source',
            layout: {
              'visibility': layer[1] ? 'visible' : 'none',
            },
          });
        }
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      if (appState.app.CHTSource.features) {
        if (!map.getSource('CHTSource')) {
          map.addSource('CHTSource', {
            type: 'geojson',
            data: appState.app.CHTSource,
          });
        }
        {
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
          }
          map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
        });
      }
    },
  };
};
