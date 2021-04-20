import { Feature } from 'geojson';
import m, { FactoryComponent, route } from 'mithril';
import { IActions, IAppModel, IGroup } from '../../services/meiosis';
import M from 'materialize-css';

export const mapSideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'ul.col.l3.m4#slide-out.sidenav.sidenav-fixed',
        {
          style: 'top: 64px; overflow-y: auto',
        },
        [
          m('h5', 'Messages'),
          m('p', /*vnode.attrs.state.app.alerts*/ 'No new messages'),
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
                  m(
                    'li.no-padding',
                    m(
                      'ul.collapsible.collapsible-accordion',
                      m('li', [
                        m('a.collapsible-header', 'Base Layers', [
                          m('i.material-icons', 'arrow_drop_down'),
                        ]),
                        m('div.collapsible-body', m('div', [
                          m(
                            'button.btn.waves-effect.waves-light.col.s12',
                            {
                              onclick: () => {
                                vnode.attrs.actions.switchStyle('mapbox/outdoors-v11');
                              },
                            },
                            'Here'),
                          m(
                            'button.btn.waves-effect.waves-light.col.s12',
                            {
                              onclick: () => {
                                vnode.attrs.actions.switchStyle('mapbox/streets-v11');
                              },
                            },
                            'Mapbox'),
                        ])),
                      ]),
                    ),
                  ),
                  m(
                    'li.no-padding',
                    m(
                      'ul.collapsible.collapsible-accordion',
                      m('li', [
                        m('a.collapsible-header', 'POI Layers', [
                          m('i.material-icons', 'arrow_drop_down'),
                        ]),
                        m('div.collapsible-body', m('div', m('form', vnode.attrs.state.app.layers.map((layer: [string, boolean], index: number) => {
                            return m('p',
                              m('label', [
                                m('input', {
                                  type: 'checkbox',
                                  class: 'filled-in',
                                  checked: layer[1],
                                  onclick: () => {
                                    vnode.attrs.actions.toggleLayer(layer, index);
                                  },
                                }),
                                m('span', layer[0])]),
                            );
                          })),
                        )),
                      ]),
                    ),
                  ),
                ])),
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
      );
    },
    oncreate: () => {
      const elemSidenav = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elemSidenav);
      const elemsCollapsible = document.querySelectorAll('.collapsible');
      M.Collapsible.init(elemsCollapsible);
    },
  };
};
