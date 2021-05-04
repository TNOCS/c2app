import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const layersBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return [
        /// BASE LAYERS
        m('li.no-padding',
          m('ul.collapsible.collapsible-accordion',
            m('li', [
              m('a.collapsible-header', 'Base Layers', [
                m('i.material-icons', 'arrow_drop_down'),
              ]),
              m('div.collapsible-body',
                m('div.row', [
                  m('button.btn.waves-effect.waves-light.col.s5.offset-s1',
                    {
                      onclick: () => {
                        vnode.attrs.actions.switchStyle('mapbox/dark-v10');
                      },
                    },
                    'Dark'),
                  m('button.btn.waves-effect.waves-light.col.s5',
                    {
                      onclick: () => {
                        vnode.attrs.actions.switchStyle('mapbox/streets-v11');
                      },
                    },
                    'Light'),
                ])),
            ]),
          ),
        ),
        /// REALTIME LAYERS
        m('li.no-padding',
          m('ul.collapsible.collapsible-accordion',
            m('li', [
              m('a.collapsible-header', 'Realtime Layers', [
                m('i.material-icons', 'arrow_drop_down'),
              ]),
              m('div.collapsible-body',
                m('div.row',
                  m('form', {
                    onsubmit: function(e: Event) {
                      e.preventDefault();
                    },
                  }, vnode.attrs.state.app.realtimeLayers.map((layer: [string, boolean], index: number) => {
                    return m('p.col.s11.right',
                      m('label', [
                        m('input', {
                          type: 'checkbox',
                          class: 'filled-in',
                          checked: layer[1],
                          onclick: () => {
                            vnode.attrs.actions.toggleLayer('realtime', index);
                          },
                        }),
                        m('span', layer[0])]),
                    );
                  })),
                )),
            ]),
          ),
        ),
        /// GRID LAYERS
        m('li.no-padding',
          m('ul.collapsible.collapsible-accordion',
            m('li', [
              m('a.collapsible-header', 'Grid Layers', [
                m('i.material-icons', 'arrow_drop_down'),
              ]),
              m('div.collapsible-body',
                m('div.row',
                  m('button.btn.modal-trigger.col.s10.offset-s1', { 'data-target': 'gridModal' }, 'Create Grid'),
                  m('form',
                    vnode.attrs.state.app.gridLayers.map((layer: [string, boolean], index: number) => {
                      return m('p.col.s11.right',
                        m('label', [
                          m('input', {
                            type: 'checkbox',
                            class: 'filled-in',
                            checked: layer[1],
                            onclick: () => {
                              vnode.attrs.actions.toggleLayer('grid', index);
                            },
                          }),
                          m('span', layer[0])]),
                      );
                    }),
                  ),
                ),
              ),
            ]),
          ),
        ),
        /// CUSTOM LAYERS
        m('li.no-padding',
          m('ul.collapsible.collapsible-accordion',
            m('li', [
              m('a.collapsible-header', 'Custom Layers', [
                m('i.material-icons', 'arrow_drop_down'),
              ]),
              m('div.collapsible-body',
                m('div.row',
                  m('button.btn.modal-trigger.col.s10.offset-s1', { 'data-target': 'customLayerModal' }, 'Create Layer'),
                  m('div.col.s12',
                    vnode.attrs.state.app.customLayers.map((layer: [string, boolean], index: number) => {
                      return m('div.collection-item',
                        m('label.row',
                          m('div.valign-wrapper', [
                            m('p.col.s7',
                              m('label', [
                                m('input', {
                                  type: 'checkbox',
                                  class: 'filled-in',
                                  checked: layer[1],
                                  onclick: () => {
                                    vnode.attrs.actions.toggleLayer('custom', index);
                                  },
                                }),
                                m('span', layer[0]),
                              ])),
                            m('a.btn.waves-effect.waves-light.col.s1.offset-s2.modal-trigger',
                              {
                                'data-target': 'editLayerModal',
                                onclick: (e: Event) => {
                                  e.preventDefault();
                                },
                              },
                              m('i.material-icons', 'edit')),
                            m('a.btn.waves-effect.waves-light.red.col.s1',
                              {
                                onclick: (e: Event) => {
                                  e.preventDefault();
                                  vnode.attrs.actions.deleteLayer(index);
                                },
                              },
                              m('i.material-icons', 'delete')),
                          ]),
                        ),
                      );
                    }),
                  ),
                ),
              ),
            ]),
          ),
        ),
      ];
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
