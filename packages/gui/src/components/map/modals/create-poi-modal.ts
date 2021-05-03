import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { Feature } from 'geojson';

export const createPOIModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let chosenTab: 'Group' | 'Layer' | 'Chemical Hazard' | 'Annotation' = 'Annotation';
  let groupName: string;
  return {
    view: (vnode) => {
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
                  disabled: chosenTab === 'Layer',
                  onclick: () => {
                    chosenTab = 'Layer';
                  },
                },
                'Layer'),
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
              : chosenTab === 'Layer' ? m('div', [
                m('p.col.s12', 'LAYER INPUT GOES HERE'),
              ])
              : chosenTab === 'Chemical Hazard' ? m('div', [
                  m('p.col.s12', 'CHT INPUT GOES HERE'),
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
                : chosenTab === 'Layer' ? vnode.attrs.actions.createPOI()
                : chosenTab === 'Chemical Hazard' ? vnode.attrs.actions.createPOI()
                  : vnode.attrs.actions.createPOI();
            },
          }, `${'Create ' + chosenTab}`),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
