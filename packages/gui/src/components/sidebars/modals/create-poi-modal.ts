import m, { FactoryComponent } from 'mithril';
import { SourceType, IActions, IAppModel, ISource } from '../../../services/meiosis';
import M from 'materialize-css';
import { Feature, Point } from 'geojson';
import { LayoutForm } from 'mithril-ui-form';
import { formGenerator } from '../../../template/form';

export const createPOIModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let chosenTab: 'Group' | 'POI' | 'Chemical Hazard' | 'Population' | 'Annotation' = 'Annotation';
  let groupName: string;
  let layerIndex: number;

  return {
    view: (vnode) => {
      let source = vnode.attrs.state.app.source;
      const form = formGenerator(source);

      return m('div.modal.modal-fixed-footer', { id: 'createPOIModal' },
        m('div.modal-content', [
          m('div.row', [
            m('div.col.s12', m('ul.tabs', [
              m('li.tab.col.s2', m('a', {
                href: '#annotation',
                onclick: () => {
                  chosenTab = 'Annotation';
                },
                active: true,
              }, m('i.material-icons', 'pin_drop'))),
              m('li.tab.col.s2', m('a', {
                href: '#group',
                onclick: () => {
                  chosenTab = 'Group';
                },
              }, m('i.material-icons', 'group'))),
              m('li.tab.col.s2', m('a', {
                href: '#POI',
                onclick: () => {
                  chosenTab = 'POI';
                },
              }, m('i.material-icons', 'layers'))),
              m('li.tab.col.s2', m('a', {
                href: '#CHT',
                onclick: () => {
                  chosenTab = 'Chemical Hazard';
                },
              }, m('i.material-icons', 'warning'))),
              m('li.tab.col.s2', m('a', {
                href: '#populator',
                onclick: () => {
                  chosenTab = 'Population';
                },
              }, m('i.material-icons', 'holiday_village'))),
            ])),
            ///Annotation
            m('div.col.s12', { id: 'annotation' }, m('div', [
              m('p.col.s12', 'Creates a drawing on this location on the map without side-effects'),
            ])),
            /// GROUP
            m('div.col.s12', { id: 'group' }, m('div', [
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
            ])),
            /// POI
            m('div.col.s12', { id: 'POI' }, m('div', [
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
                  vnode.attrs.state.app.sources.map((source: ISource, index: number) => {
                    if (source.sourceCategory !== SourceType.custom) return;
                    return m('option', { value: index }, source.sourceName);
                  }),
                ),
                m('label', { for: 'layerSelect' }, 'Choose the layer'),
              ]),
            ])),
            /// CHT
            m('div.col.s12', { id: 'CHT' }, m('div', [
              m('p.col.s12', 'Creates a chemical hazard on this location on the map'),
              m(LayoutForm, {
                form,
                obj: source,
                section: 'source',
              }),
            ])),
            ///Population
            m('div.col.s12', { id: 'populator' }, m('div', [
              m('p.col.s12', 'Creates a populator service query for this point on the map'),
            ])),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              chosenTab === 'Group' ? vnode.attrs.actions.createGroup(groupName)
                : chosenTab === 'POI' ? vnode.attrs.actions.addDrawingsToLayer(layerIndex)
                : chosenTab === 'Chemical Hazard' ? vnode.attrs.actions.submitCHT(source, (vnode.attrs.state.app.latestDrawing.geometry as Point).coordinates)
                  : chosenTab === 'Population' ? vnode.attrs.actions.createPOI()
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
