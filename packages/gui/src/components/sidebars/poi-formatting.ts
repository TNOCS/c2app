import m, { FactoryComponent } from 'mithril';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { IActions, ISource, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';
import { IChemicalIncident, IChemicalIncidentControlParameters, IChemicalIncidentScenario } from '../../../../shared/src';
import { LayoutForm } from 'mithril-ui-form';
import { formGenerator } from '../../template/form';

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

      return m('div', [
        m('p', 'ID: ' + ft.properties?.id),
        m('p', 'Type: ' + ft.properties?.resourceType),
        m('p', 'Sub Type: ' + ft.properties?.resourceSubType),
        m('p', 'Height: ' + ft.properties?.height),
      ]);
    },
  };
};

export const sensorFormatComponent: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      const ft = vnode.attrs.state.app.clickedFeature as MapboxGeoJSONFeature;

      return m('div', [
        m('p', 'ID: ' + ft.properties?.id),
        m('p', 'Type: ' + ft.properties?.sensorType),
        m('p', 'Height: ' + ft.properties?.height),
        m('p', ft.properties?.measurement.type + ': ' + ft.properties?.measurement.value + ' ' + ft.properties?.measurement.unit),
      ]);
    },
  };
};

export const incidentLocationFormatComponent: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let source = { scenario: {} as IChemicalIncidentScenario, control_parameters: {} as IChemicalIncidentControlParameters};
  return {
    view: (vnode) => {
      const ft = vnode.attrs.state.app.clickedFeature as MapboxGeoJSONFeature;
      const scenario = JSON.parse(ft.properties?.scenario) as IChemicalIncidentScenario;
      const control_parameters = JSON.parse(ft.properties?.control_parameters) as IChemicalIncidentControlParameters;
      const form = formGenerator({});

      return [
          m('p', 'ID: ' + ft.properties?.id),
          m('p', 'Chemical: ' + scenario.chemical),
          m('p', 'Start of release: ' + scenario.start_of_release),
          m('p', 'Toxicity: ' + scenario.toxicity),
          m('p', 'Height: ' + control_parameters.z + 'm'),
          m('button.btn', {
            onclick: () => {
              source.scenario.source_location = scenario.source_location;
              const chemicalIncident = {
                context: ft.properties?.context,
                _id: ft.properties?.id,
                scenario: source.scenario,
                control_parameters: source.control_parameters,
                timestamp: new Date().valueOf()
              } as IChemicalIncident;
              
              vnode.attrs.actions.submitCHT2(chemicalIncident);
            },
          }, 'Recalculate'),
          m(LayoutForm, {
            form,
            obj: source,
            section: 'source',
          }),
          m('p', 'test text')
      ];
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};

