import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services';
import * as MapUtils from '../../models/map';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher';
import RulerControl from 'mapbox-gl-controls/lib/ruler';
import { Feature } from 'geojson';
import car from 'url:../../assets/Car.png';
import fireman from 'url:../../assets/Firemen unit.png';

export const Mapbox: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ';
  let map: mapboxgl.Map;

  return {
    view: () => {
      return m('div.col.s12.l9.right', { id: 'mapboxMap' });
    },
    // Executes once on creation
    oncreate: (vnode) => {
      const { actions } = vnode.attrs;

      // Create map and add controls
      map = new mapboxgl.Map(MapUtils.mapConfig);
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(new MapboxStyleSwitcherControl(MapUtils.mapStyles, 'Mapbox'), 'top-left');
      map.addControl(new MapboxDraw(MapUtils.drawConfig), 'top-left');
      map.addControl(new RulerControl, 'top-left')

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
      } else if (state.app.positionSource?.type) {
        map.addSource('positions', {
          type: 'geojson',
          data: state.app.positionSource,
        });

        map.loadImage(fireman, function (error, image) {
          if (error) throw error;
          map.addImage('fireman', image as ImageBitmap);

          map.addLayer({
            id: 'geojson_fr',
            type: 'symbol',
            source: 'positions',
            layout: {
              'icon-image': 'fireman',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            },
            filter: ['==', 'type', 'man'],
          });
        });

        map.loadImage(car, function (error, image) {
          if (error) throw error;
          map.addImage('car', image as ImageBitmap);

          map.addLayer({
            id: 'geojson_fr2',
            type: 'symbol',
            source: 'positions',
            layout: {
              'icon-image': 'car',
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            },
            filter: ['==', 'type', 'car'],
          });
        });
      }
    },
  };
};
