import { Feature } from 'geojson';
import m, { FactoryComponent, route } from 'mithril';
import { IActions, IAppModel, IGroup } from '../../services/meiosis';
import M from 'materialize-css';

export const mapSideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let gridCellSize: string;
  let updateLocation: boolean = false;
  let layerName: string;
  let layerType: string;
  return {
    view: (vnode) => {
      return [
        m('div.modal.modal-fixed-footer', { id: 'customLayerModal' },
          m('div.modal-content', [
            m('h4', 'Create Layer'),
            m('row', [
              m('div.input-field.col.s12', [
                m('input', {
                  id: 'layerName',
                  type: 'text',
                  value: layerName,
                  onchange: (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    layerName = target.value;
                  },
                }),
                m(
                  'label',
                  {
                    for: 'layerName',
                  },
                  'Layer Name',
                ),
              ]),
              m('div.input-field.col.s12', [
                m(
                  'select',
                  {
                    onchange: (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      layerType = target.value;
                    },
                  },
                  [
                    m('option', { value: '', disabled: true, selected: true }, 'Choose the Layer Type'),
                    m('option', { value: 'polygon' }, 'Polygon'),
                    m('option', { value: 'point' }, 'Point'),
                    m('option', { value: 'both' }, 'Polygon and Point'),
                  ],
                ),
                m('label', 'Layer Type'),
              ]),
            ]),
          ]),
          m('div.modal-footer',
            m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
            m('a.modal-close.waves-effect.waves-green.btn-flat', {
              onclick: () => {
                vnode.attrs.actions.updateCustomLayers(layerName, layerType);
              },
            }, 'Create Layer'),
          ),
        ),
        m('div.modal.modal-fixed-footer', { id: 'gridModal' },
          m('div.modal-content', [
            m('h4', 'Create Grid'),
            m('row', [
              m('div.input-field.col.s12', [
                m('input', {
                  id: 'gridCellSize',
                  type: 'text',
                  value: gridCellSize,
                  onchange: (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    gridCellSize = target.value;
                  },
                }),
                m(
                  'label',
                  {
                    for: 'gridCellSize',
                  },
                  'Cell Size (km)',
                ),
              ]),
              m('p.col.s12',
                m('label', [
                  m('input', {
                    type: 'checkbox',
                    class: 'filled-in',
                    checked: updateLocation,
                    onclick: () => {
                      updateLocation = !updateLocation;
                    },
                  }),
                  m('span', 'Fit Grid to Current Viewport')]),
              ),
            ]),
          ]),
          m('div.modal-footer',
            m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
            m('a.modal-close.waves-effect.waves-green.btn-flat', {
              onclick: () => {
                vnode.attrs.actions.updateGridOptions(Number(gridCellSize), updateLocation);
              },
            }, 'Create Grid'),
          ),
        ),
        m(
          'ul.col.l3.m4#slide-out.sidenav.sidenav-fixed',
          {
            style: 'top: 64px; overflow-y: auto',
          },
          [
            m('h5', 'Messages'),
            m('p', /*vnode.attrs.state.app.alerts*/ 'No new messages'),
            /// POIS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'POIs', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'add_location'),
                  ]),
                  m(
                    'div.collapsible-body',
                    m('div', [
                      m('h5', 'Clicked POI'),
                      m(
                        'button.button[type=button]',
                        {
                          onclick: () => {
                            vnode.attrs.actions.resetClickedFeature();
                          },
                        },
                        'Clear clicked POI',
                      ),
                      m(
                        'p',
                        `${
                          vnode.attrs.state.app.clickedFeature
                            ? 'Type: ' +
                            JSON.stringify(vnode.attrs.state.app.clickedFeature?.properties?.type) +
                            ' Callsign: ' +
                            JSON.stringify(vnode.attrs.state.app.clickedFeature?.properties?.name)
                            : ''
                        }`,
                      ),
                    ]),
                  ),
                ]),
              ),
            ),
            /// GROUPS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'Groups', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'group'),
                  ]),
                  m(
                    'div.collapsible-body',
                    m('div', [
                      m('h5', 'Selected FRs'),
                      [
                        m(
                          'button.button[type=button]',
                          {
                            onclick: () => {
                              vnode.attrs.actions.resetSelectedFeatures();
                            },
                          },
                          'Clear selected FRs',
                        ),
                        m(
                          'button.button[type=button]',
                          {
                            onclick: () => {
                              vnode.attrs.actions.createGroup();
                            },
                          },
                          'Group selected FRs',
                        ),
                      ],
                      m(
                        'p',
                        vnode.attrs.state.app.selectedFeatures?.features.map((feature: Feature) => {
                          return m('span', JSON.stringify(feature.type));
                        }),
                      ),
                      m('h5', 'Groups'),
                      m(
                        'p',
                        vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
                          return m('p', [
                            m('p', 'ID: ' + index + ' Members: ' + group.callsigns.length, [
                              m(
                                'button.button[type=button]',
                                {
                                  onclick: () => {
                                    vnode.attrs.actions.updateGroup(group);
                                  },
                                },
                                'Update',
                              ),
                              m(
                                'button.button[type=button]',
                                {
                                  onclick: () => {
                                    vnode.attrs.actions.deleteGroup(group);
                                  },
                                },
                                'Delete',
                              ),
                            ]),
                          ]);
                        }),
                      ),
                    ]),
                  ),
                ]),
              ),
            ),
            /// LAYERS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'Layers', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'layers'),
                  ]),
                  m('div.collapsible-body', m('div', [
                      /// BASE LAYERS
                      m(
                        'li.no-padding',
                        m(
                          'ul.collapsible.collapsible-accordion',
                          m('li', [
                            m('a.collapsible-header', 'Base Layers', [
                              m('i.material-icons', 'arrow_drop_down'),
                            ]),
                            m('div.collapsible-body', m('div.row', [
                              m(
                                'button.btn.waves-effect.waves-light.col.s5.offset-s1',
                                {
                                  onclick: () => {
                                    vnode.attrs.actions.switchStyle('mapbox/dark-v10');
                                  },
                                },
                                'Dark'),
                              m(
                                'button.btn.waves-effect.waves-light.col.s5',
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
                      m(
                        'li.no-padding',
                        m(
                          'ul.collapsible.collapsible-accordion',
                          m('li', [
                            m('a.collapsible-header', 'Realtime Layers', [
                              m('i.material-icons', 'arrow_drop_down'),
                            ]),
                            m('div.collapsible-body', m('div.row', m('form', {
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
                      m(
                        'li.no-padding',
                        m(
                          'ul.collapsible.collapsible-accordion',
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
                      m(
                        'li.no-padding',
                        m(
                          'ul.collapsible.collapsible-accordion',
                          m('li', [
                            m('a.collapsible-header', 'Custom Layers', [
                              m('i.material-icons', 'arrow_drop_down'),
                            ]),
                            m('div.collapsible-body',
                              m('div.row',
                                m('button.btn.modal-trigger.col.s10.offset-s1', { 'data-target': 'customLayerModal' }, 'Create Layer'),
                                m('div.collection.col.s12',
                                  vnode.attrs.state.app.customLayers.map((layer: [string, boolean], index: number) => {
                                    return m('div.collection-item',
                                      m('label.row', [
                                        m('input.col.s2', {
                                          type: 'checkbox',
                                          class: 'filled-in',
                                          checked: layer[1],
                                          onclick: () => {
                                            vnode.attrs.actions.toggleLayer('custom', index);
                                          },
                                        }),
                                        m('span.col.s10', layer[0]),
                                        m('button.btn.modal-trigger.col.s5.offset-s1', {
                                          onclick: ()=> {
                                            console.log('add point')
                                          }
                                        }, 'Point'),
                                        m('button.btn.modal-trigger.col.s5.offset-s1', {
                                          onclick: ()=> {
                                            console.log('add polygon')
                                          }
                                        }, 'Polygon'),
                                      ]),
                                    );
                                  }),
                                ),
                              ),
                            ),
                          ]),
                        ),
                      ),
                    ]),
                  ),
                ]),
              ),
            ),
            m('div.divider'),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Map',
                  onclick: () => {
                    route.set('/mapbox');
                  },
                },
                m('i.material-icons', 'map'),
              ),
            ),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Chat',
                  onclick: () => {
                    route.set('/chat');
                  },
                },
                m('i.material-icons', 'chat'),
              ),
            ),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Settings',
                  onclick: () => {
                    route.set('/settings');
                  },
                },
                m('i.material-icons', 'settings'),
              ),
            ),
            // Fix the weird scroll clipping caused by
            m('div', { style: 'margin: 128px' }),
          ],
        )]
        ;
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
