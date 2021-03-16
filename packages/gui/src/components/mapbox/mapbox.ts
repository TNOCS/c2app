import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services';
import * as MapUtils from '../../models/map';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher';
import { Feature } from 'geojson';

export const Mapbox: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ';
  let map: mapboxgl.Map;

  return {
    view: () => {
      return m('.row', [
        m(`div`, {
          id: 'mapboxMap',
          style: `position: absolute; top: 64px; height: ${window.innerHeight - 64}; left: 0px; width: ${
            window.innerWidth - 250
          };`,
        }),
      ]);
    },
    // Executes once on creation
    oncreate: (vnode) => {
      const { actions } = vnode.attrs;

      // Create map and add controls
      map = new mapboxgl.Map(MapUtils.mapConfig);
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new MapboxStyleSwitcherControl(MapUtils.mapStyles, 'Mapbox'));
      map.addControl(new MapboxDraw(MapUtils.drawConfig));

      // Add map listeners and socket listener
      map.on('load', () => {
        map.on('draw.create', ({ features }) => MapUtils.getFeaturesInPolygon(map, features, actions));
        map.on('draw.update', ({ features }) => MapUtils.getFeaturesInPolygon(map, features, actions));
        map.on('click', 'geojson_fr', ({ features }) => MapUtils.displayPopup(features as Feature[], actions));
        map.on('mouseenter', 'geojson_fr', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'geojson_fr', () => (map.getCanvas().style.cursor = ''));
      });
    },
    // Executes on every redraw
    onupdate: (vnode) => {
      if (!map.loaded()) return;

      const { state } = vnode.attrs;

      if (map.getSource('positions')) {
        (map.getSource('positions') as GeoJSONSource).setData(state.app.positionSource);
      } else {
        map.addSource('positions', {
          type: 'geojson',
          data: state.app.positionSource,
        });

        map.addLayer({
          id: 'geojson_fr',
          type: 'circle',
          source: 'positions',
          paint: {
            'circle-radius': 6,
            'circle-color': '#B42222',
          },
          filter: ['==', '$type', 'Point'],
        });

        if (map.getSource('chemical-hazards')) {
          (map.getSource('chemical-hazards') as GeoJSONSource).setData(state.app.chemicalHazardSource);
        } else {
          map.addSource('chemical-hazards', {
            type: 'geojson',
            data: state.app.chemicalHazardSource,
          });

          map.addLayer({
            id: 'chemical-hazard',
            type: 'circle',
            source: 'chemical-hazards',
            paint: {
              'circle-radius': 6,
              'circle-color': '#B42222',
            },
            filter: ['==', '$type', 'Point'],
          });
        }
      }
    },
  };
};
