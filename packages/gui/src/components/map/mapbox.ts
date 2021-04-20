import m, { FactoryComponent } from 'mithril';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
// @ts-ignore
import RulerControl from 'mapbox-gl-controls/lib/ruler';
import { Feature } from 'geojson';
import { IActions, IAppModel } from '../../services/meiosis';
import * as MapUtils from '../../models/map';
// @ts-ignore
import car from 'url:../../assets/car_icon.png';
// @ts-ignore
import fireman from 'url:../../assets/fireman_icon.png';

export const Mapbox: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3ZkayIsImEiOiJja2xrcXFvdjAwYjRxMnFxam9waDhsbzMwIn0.7YMAFBQuqBei0991lnw1sQ';
  let map: mapboxgl.Map;
  let draw: MapboxDraw;

  // styleID should be in the form "mapbox/satellite-v9"
  const switchBasemap = async (styleID: string) => {
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

    //newStyle.sprite = currentStyle.sprite;
    map.setStyle(newStyle);

    map.loadImage(fireman, function(error, image) {
      if (error) throw error;
      if (!map.hasImage('fireman')) map.addImage('fireman', image as ImageBitmap);
    });
    map.loadImage(car, function(error, image) {
      if (error) throw error;
      if (!map.hasImage('car')) map.addImage('car', image as ImageBitmap);
    });
  };


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
        map.on('click', 'geojson_fr', ({ features }) => MapUtils.displayPopup(features as Feature[], actions));
        map.on('mouseenter', 'geojson_fr', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'geojson_fr', () => (map.getCanvas().style.cursor = ''));
        map.once('styledata', () => {
          map.addSource('positions', {
            type: 'geojson',
            data: appState.app.positionSource,
          });

          map.loadImage(fireman, function(error, image) {
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
              filter: ['all', ['in', 'type', 'man', 'firefighter']],
            });
          });

          map.loadImage(car, function(error, image) {
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
                'visibility': 'visible',
              },
              filter: ['==', 'type', 'car'],
            });
          });
        });
      });
    },
    // Executes on every redraw
    onupdate: ({ attrs: { state: appState, actions } }) => {
      if (!map.loaded()) return;

      if (appState.app.switchStyle) {
        switchBasemap(appState.app.mapStyle);
        actions.styleSwitched();
      }

      appState.app.layers.forEach((layer: [string, boolean]) => {
        map.setLayoutProperty(layer[0], 'visibility', layer[1] ? 'visible' : 'none');
      });

      (map.getSource('positions') as GeoJSONSource).setData(appState.app.positionSource);
    },
  };
};
