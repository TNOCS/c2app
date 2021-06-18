import m from 'mithril';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { IActions, ISource } from '../../services/meiosis';

export const formatMan = (ft: MapboxGeoJSONFeature) => {
  const props = ft?.properties;
  console.log(ft);
  return m('div', [
    m('p', 'Layer Name: ' + ft.layer.id),
    m('p', 'Type: ' + props?.type),
    m('p', 'Callsign: ' + props?.name),
  ]);
};
export const formatCar = (ft: MapboxGeoJSONFeature) => {
  const props = ft?.properties;
  console.log(ft);
  return m('div', [
    m('p', 'Layer Name: ' + ft.layer.id),
    m('p', 'Type: ' + props?.type),
  ]);
};

export const formatUnknown = (ft: MapboxGeoJSONFeature) => {
  const props = ft?.properties;
  console.log(ft);
  return m('div', [
    m('p', 'Layer Name: ' + ft.layer.id),
    m('p', 'Type: ' + props?.type),
  ]);
};

import { FactoryComponent } from 'mithril';
import { IAppModel } from '../../services/meiosis';
import M from 'materialize-css';

export const alertFormatComponent: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      const ft = vnode.attrs.state.app.clickedFeature as MapboxGeoJSONFeature;
      const alert = vnode.attrs.state.app.sources.find((v: ISource) => {
        return v.sourceName === ft.source;
      }) as ISource;
      return m('div', [
        m('p', 'Layer Name: ' + ft.layer.id),
        m('p', 'Source Name: ' + ft.source),
        m('p.range-field', m('input-field', [
            m('input', {
              type: 'range',
              min: '0',
              max: alert.layers[alert.layers.length - 1].layerName,
              onchange: (event: Event) => {
                vnode.attrs.actions.setCHOpacities(Number((event.target as HTMLInputElement).value), alert.sourceName);
              },
            }),
            m('label', 'Delta time [s]'),
          ]),
        ),
      ]);
    },
    oncreate: () => {
      const array_of_dom_elements = document.querySelectorAll('input[type=range]');
      M.Range.init(array_of_dom_elements);
    },
  };
};
