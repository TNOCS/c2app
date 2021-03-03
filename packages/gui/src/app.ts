import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import m from "mithril"
import 'mapbox-gl/dist/mapbox-gl.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl-style-switcher/styles.css'
import './styles.css';
import { routingSvc } from './services/RoutingService';

m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());