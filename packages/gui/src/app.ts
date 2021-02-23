import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import m from "mithril"
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { routingSvc } from './services/RoutingService';

m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());