import m from 'mithril';
import { routingSvc } from './services/routing-service';

import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import './styles.css';

process.env.NODE_ENV === 'development' && console.log('Running in development: no service worker');
if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
