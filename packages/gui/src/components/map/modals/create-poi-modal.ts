import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { Feature, FeatureCollection, Geometry, Point } from 'geojson';
import { LayoutForm } from 'mithril-ui-form';
import { formGenerator } from '../../../template/form';
import { IChemicalHazard } from '../../../../../shared/src';

export const createPOIModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let chosenTab: 'Group' | 'POI' | 'Chemical Hazard' | 'Annotation' = 'Annotation';
  let groupName: string;
  let layerIndex: number;
  const state = {
    map: undefined as undefined,
    overlays: {} as { [key: string]: any },
    zoom: 10,
    loaded: false,
    isValid: false,
    error: '',
    deltaTime: 0,
    /** Relevant context for the Form, can be used with show/disabling */
    context: {
      admin: true,
    },
    sources: undefined as undefined | FeatureCollection<Point>,
    clouds: undefined as undefined,
    canPublish: false,
    version: 0,
    geojsonClouds: undefined as undefined | FeatureCollection<Geometry>,
  };

  const formChanged = (source: Partial<IChemicalHazard>, isValid: boolean) => {
    state.canPublish = isValid;
    console.log(JSON.stringify(source, null, 2));
  };

  return {
    view: (vnode) => {
      let source = vnode.attrs.state.app.source;
      const form = formGenerator(source);
      let context = state.context;

      return m('div.modal.modal-fixed-footer', { id: 'createPOIModal' },
        m('div.modal-content', [
          m('h4', `${'Create ' + chosenTab}`),
          m('row', [
            m('div.input-field.col.s12', [
              m('button.btn.waves-effect.waves-light.col.s3',
                {
                  disabled: chosenTab === 'Annotation',
                  onclick: () => {
                    chosenTab = 'Annotation';
                  },
                },
                'Annotation'),
              m('button.btn.waves-effect.waves-light.col.s3',
                {
                  disabled: chosenTab === 'Group',
                  onclick: () => {
                    chosenTab = 'Group';
                  },
                },
                'Group'),
              m('button.btn.waves-effect.waves-light.col.s3',
                {
                  disabled: chosenTab === 'POI',
                  onclick: () => {
                    chosenTab = 'POI';
                  },
                },
                'POI'),
              m('button.btn.waves-effect.waves-light.col.s3',
                {
                  disabled: chosenTab === 'Chemical Hazard',
                  onclick: () => {
                    chosenTab = 'Chemical Hazard';
                  },
                },
                'CHT'),
            ]),
          ]),
          m('row', [
            chosenTab === 'Group' ? m('div', [
                m('p', 'Selected FRs'),
                m('p', vnode.attrs.state.app.selectedFeatures?.features.map((feature: Feature) => {
                    return m('span', JSON.stringify(feature.type));
                  }),
                ),
                m('div.input-field.col.s4', [
                  m('input', {
                    id: 'groupName',
                    type: 'text',
                    value: groupName,
                    onchange: (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      groupName = target.value;
                    },
                  }),
                  m(
                    'label',
                    {
                      for: 'groupName',
                    },
                    'Group Name',
                  ),
                ]),
                m('div.col.s4'),
                m('div.col.s4'),
              ])
              : chosenTab === 'POI' ? m('div', [
                m('p.col.s12', 'POI INPUT GOES HERE'),
                m('div.input-field.col.s12', [
                  m('select', {
                      id: 'layerSelect',
                      input: layerIndex,
                      onchange: (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        layerIndex = Number(target.value);
                      },
                    },
                    m('option', { value: '', disabled: true, selected: true }, 'Choose the layer'),
                    vnode.attrs.state.app.customLayers.map((layer: [string, boolean], index: number) => {
                      return m('option', { value: index }, layer[0]);
                    }),
                  ),
                  m('label', { for: 'layerSelect' }, 'Choose the layer'),
                ]),
              ])
              :
              chosenTab === 'Chemical Hazard' ? m('div', [
                  m('p.col.s12', 'CHT INPUT GOES HERE'),
                  m(LayoutForm, {
                    form,
                    obj: source,
                    onchange: (isValid) => {
                      formChanged(source, isValid);
                      // console.log(JSON.stringify(obj, null, 2));
                    },
                    context,
                    section: 'source',
                  }),
                ])
                : m('div', [
                  m('p.col.s12', 'Creates a drawing on a map without side-effects.'),
                ]),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              chosenTab === 'Group' ? vnode.attrs.actions.createGroup()
                : chosenTab === 'POI' ? vnode.attrs.actions.addDrawingsToLayer(layerIndex)
                : chosenTab === 'Chemical Hazard' ? vnode.attrs.actions.submitCHT(source, (vnode.attrs.state.app.drawings.features[0].geometry as Point).coordinates)
                  : vnode.attrs.actions.createPOI();
            },
          }, `${'Create ' + chosenTab}`),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
    onupdate: () => {
      const elem = document.getElementById('layerSelect') as HTMLElement;
      M.FormSelect.init(elem);
    },
  };
};
