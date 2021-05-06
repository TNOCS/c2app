import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { Feature, Point } from 'geojson';
import { LayoutForm } from 'mithril-ui-form';
import { formGenerator } from '../../../template/form';

export const createPOIModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let chosenTab: 'Group' | 'POI' | 'Chemical Hazard' | 'Annotation' = 'Annotation';
  let groupName: string;
  let layerIndex: number;

  return {
    view: (vnode) => {
      let source = vnode.attrs.state.app.source;
      const form = formGenerator(source);

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
                m('p', 'Creates a group of the selected First Responders listed below'),
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
                m('p.col.s12', 'Creates a POI on this location on the map and adds it to the selected layer'),
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
                  m('p.col.s12', 'Creates a chemical hazard on this location on the map'),
                  m(LayoutForm, {
                    form,
                    obj: source,
                    section: 'source',
                  }),
                ])
                : m('div', [
                  m('p.col.s12', 'Creates a drawing on this location on the map without side-effects'),
                ]),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              chosenTab === 'Group' ? vnode.attrs.actions.createGroup()
                : chosenTab === 'POI' ? vnode.attrs.actions.addDrawingsToLayer(layerIndex)
                : chosenTab === 'Chemical Hazard' ? vnode.attrs.actions.submitCHT(source, (vnode.attrs.state.app.latestDrawing.geometry as Point).coordinates)
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
