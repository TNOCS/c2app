import m from 'mithril';
import { Feature } from 'geojson';

export const formatMan = (ft: Feature) => {
  const props = ft?.properties;
  return m('div', [
    m('p', 'Type: ' + props?.type),
    m('p', 'Callsign: ' + props?.name),
  ]);
};
export const formatCar = (ft: Feature) => {
  const props = ft?.properties;
  return m('div', [
    m('p', 'Type: ' + props?.type),
  ]);
};
export const formatUnknown = (ft: Feature) => {
  const props = ft?.properties;
  return m('div', [
    m('p', 'Type: ' + props?.type),
  ]);
};
