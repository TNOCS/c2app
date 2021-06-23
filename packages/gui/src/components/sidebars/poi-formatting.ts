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
    m('p', 'ID: ' + props?.id),
    m('p', 'Height: ' + props?.height),
  ]);
};

import { FactoryComponent } from 'mithril';
import { IAppModel } from '../../services/meiosis';
import M from 'materialize-css';
import { IAssistanceResource, ISensor } from '../../../../shared/src';

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

export const resourceFormatComponent: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      const ft = vnode.attrs.state.app.clickedFeature as MapboxGeoJSONFeature;
      let resource = {} as IAssistanceResource;
      let sensors = [] as ISensor[];
      for (const key in vnode.attrs.state.app.resourceDict) {
        const rsc = vnode.attrs.state.app.resourceDict[key];
        if (rsc._id === ft.properties?.id) resource = rsc as IAssistanceResource;
      }

      for (const key in vnode.attrs.state.app.sensorDict) {
        const snsr = vnode.attrs.state.app.sensorDict[key];
        if (snsr.mission === ft.properties?.mission) sensors.push(snsr as ISensor);
      }

      return m('div', [
        m('p', 'Layer Name: ' + ft.layer.id),
        m('p', 'ID: ' + resource._id),
        m('p', 'Mission: ' + resource.mission),
        m('p', 'Height: ' + resource.height),
        m('div', sensors.map((sens: ISensor) => {
            return [
              m('p', sens._id),
              m('p', sens.type),
              m('p', sens.measurement.type + ': ' + sens.measurement.value + ' ' + sens.measurement.unit),
            ]
          }),
        ),
      ]);
    },
  };
};
