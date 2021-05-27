import m from 'mithril';
import { GeoJsonProperties } from 'geojson';

export const formatMan = (props: GeoJsonProperties) => {
  return m('div', [
    m('p', 'Type: ' + JSON.stringify(props?.type)),
    m('p', 'Callsign: ' + JSON.stringify(props?.name)),
  ]);
};
export const formatCar = (props: GeoJsonProperties) => {
  return m('div', [
    m('p', 'Type: ' + JSON.stringify(props?.type)),
  ]);
};
export const formatUnknown = (props: GeoJsonProperties) => {
  return m('div', [
    m('p', 'Type: ' + JSON.stringify(props?.type)),
  ]);
};
