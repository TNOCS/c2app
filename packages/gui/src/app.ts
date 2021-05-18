import m from 'mithril';
import { routingSvc } from './services/routing-service';

import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import './styles.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.ts').then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
