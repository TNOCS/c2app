import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel, ILayer, ISource, SourceType } from '../../../services/meiosis';
import M from 'materialize-css';

export const layersBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div', [
        /// BASE LAYERS
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'Base Layers'),
            m('div.collapsible-body', m('div.row', [
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
                m('div.valign-wrapper.col.s12', [
                  m('div.switch.col.s2',
                    m('label', [
                      m('input', {
                        type: 'checkbox',
                        checked: vnode.attrs.state.app.showSatellite,
                        onclick: () => {
                          vnode.attrs.actions.toggleSatellite();
                        },
                      }),
                      m('span.lever'),
                    ])),
                  m('p.col.s9', 'NL Satellite'),
                ])
            ])),
          ]),
        ]),
        /// REALTIME LAYERS
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'Realtime Layers'),
            m('div.collapsible-body', m('div.row',
              m('div.col.s12',
                vnode.attrs.state.app.sources.map((source: ISource, sourceIndex: number) => {
                  if (source.sourceCategory !== SourceType.realtime) return;
                  return source.layers.map((layer: ILayer, layerIndex: number) => {
                    return m('div.valign-wrapper', [
                      m('div.switch.col.s2',
                        m('label', [
                          m('input', {
                            type: 'checkbox',
                            checked: layer.showLayer,
                            onclick: () => {
                              vnode.attrs.actions.toggleLayer(sourceIndex, layerIndex);
                            },
                          }),
                          m('span.lever'),
                        ])),
                      m('p.col.s9', layer.layerName),
                    ]);
                  });
                }),
              ),
            )),
          ]),
        ]),
        /// GRID LAYERS
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'Grid Layers'),
            m('div.collapsible-body', m('div.row',
              m('button.btn.modal-trigger.col.s10.offset-s1', { 'data-target': 'gridModal' }, 'Create Grid'),
              m('div.col.s12',
                vnode.attrs.state.app.sources.map((source: ISource, sourceIndex: number) => {
                  if (source.sourceCategory !== SourceType.grid) return;
                  return source.layers.map((layer: ILayer, layerIndex: number) => {
                    return m('div.valign-wrapper', [
                      m('div.switch.col.s2',
                        m('label', [
                          m('input', {
                            type: 'checkbox',
                            class: 'filled-in',
                            checked: layer.showLayer,
                            onclick: () => {
                              vnode.attrs.actions.toggleLayer(sourceIndex, layerIndex);
                            },
                          }),
                          m('span.lever'),
                        ])),
                      m('p.col.s9', layer.layerName),
                    ]);
                  });
                }),
              ),
            )),
          ]),
        ]),
        /// CUSTOM LAYERS
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'Custom Layers'),
            m('div.collapsible-body', m('div.row',
              m('button.btn.modal-trigger.col.s10.offset-s1', { 'data-target': 'customLayerModal' }, 'Create Layer'),
              m('div.col.s12',
                vnode.attrs.state.app.sources.map((source: ISource, sourceIndex: number) => {
                  if (source.sourceCategory !== SourceType.custom) return;
                  return source.layers.map((layer: ILayer, layerIndex: number) => {
                    return m('div.collection-item',
                      m('div.valign-wrapper', [
                        m('div.switch.col.s2.left-align',
                          m('label', [
                            m('input', {
                              type: 'checkbox',
                              class: 'filled-in',
                              checked: layer.showLayer,
                              onclick: () => {
                                vnode.attrs.actions.toggleLayer(sourceIndex, layerIndex);
                              },
                            }),
                            m('span.lever'),
                          ])),
                        m('p.col.s5.left-align', layer.layerName),
                        m('a.btn.waves-effect.waves-light.col.s2.offset-s1.right-align.modal-trigger',
                          {
                            'data-target': 'editLayerModal',
                            onclick: () => {
                              vnode.attrs.actions.setLayerEdit(sourceIndex);
                            },
                          },
                          m('i.material-icons', 'edit')),
                        m('a.btn.waves-effect.waves-light.red.col.s2.right-align',
                          {
                            onclick: () => {
                              vnode.attrs.actions.deleteLayer(sourceIndex);
                            },
                          },
                          m('i.material-icons', 'delete')),
                      ]),
                    );
                  });
                }),
              ),
            )),
          ]),
        ]),
        /// Alert Layers
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'Alert Layers'),
            m('div.collapsible-body', m('div.row',
              m('div.col.s12',
                vnode.attrs.state.app.sources.map((source: ISource, sourceIndex: number) => {
                  if (source.sourceCategory !== SourceType.alert) return;
                  return m('div.valign-wrapper', [
                    m('div.switch.col.s3',
                      m('label', [
                        m('input', {
                          type: 'checkbox',
                          class: 'filled-in',
                          checked: source.layers[0].showLayer,
                          onclick: () => {
                            vnode.attrs.actions.toggleLayer(sourceIndex, -1);
                          },
                        }),
                        m('span.lever'),
                      ])),
                    m('p.col.s9', source.sourceName),
                  ]);
                }),
              ),
            )),
          ]),
        ]),
        /// CHT
        m('ul.collapsible', [
          m('li', [
            m('div.divider'),
            m('div.collapsible-header', 'CBRN Hazard Layers'),
            m('div.collapsible-body', m('div.row',
              m('div.col.s12',
                vnode.attrs.state.app.sources.map((source: ISource, sourceIndex: number) => {
                  if (source.sourceCategory !== SourceType.chemical_incident && source.sourceCategory !== SourceType.plume) return;
                  return m('div.valign-wrapper', [
                    m('div.switch.col.s3',
                      m('label', [
                        m('input', {
                          type: 'checkbox',
                          class: 'filled-in',
                          checked: source.layers[0].showLayer,
                          onclick: () => {
                            vnode.attrs.actions.toggleLayer(sourceIndex, -1);
                          },
                        }),
                        m('span.lever'),
                      ])),
                    m('p.col.s9', source.sourceName),
                  ]);
                }),
              ),
            )),
          ]),
        ]),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
