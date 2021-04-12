import { Feature } from 'geojson';
import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel, IGroup } from '../../services';

export const sideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'ul.col.l3.m4#slide-out.sidenav.sidenav-fixed.top:64px',
        {
          style: 'top: 64px',
        },
        [
          m('h5', 'Messages'),
          m('p', /*vnode.attrs.state.app.alerts*/ 'No new messages'),
          m(
            'li.no-padding',
            m(
              'ul.collapsible.collapsible-accordion',
              m('li', [
                m('a.collapsible-header', 'Groups', m('i.material-icons', 'arrow_drop_down')),
                m(
                  'div.collapsible-body',
                  m('div', [
                    m('h5', 'Clicked Feature'),
                    m(
                      'button.button[type=button]',
                      {
                        onclick: () => {
                          vnode.attrs.actions.resetClickedFeature();
                        },
                      },
                      'Reset clicked features'
                    ),
                    m('p', JSON.stringify(vnode.attrs.state.app.clickedFeature?.type)),
                    m('h5', 'Selected Features'),
                    [
                      m(
                        'button.button[type=button]',
                        {
                          onclick: () => {
                            vnode.attrs.actions.resetSelectedFeatures();
                          },
                        },
                        'Reset selected features'
                      ),
                      m(
                        'button.button[type=button]',
                        {
                          onclick: () => {
                            vnode.attrs.actions.groupSelectedFeatures();
                          },
                        },
                        'Group selected features'
                      ),
                    ],
                    m(
                      'p',
                      vnode.attrs.state.app.selectedFeatures?.features.map((feature: Feature) => {
                        return m('span', JSON.stringify(feature.type));
                      })
                    ),
                    m('h5', 'Selected Features'),
                    m(
                      'p',
                      vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
                        return m('p', [
                          m('p', 'ID: ' + index + ' Members: ' + group.data.features.length, [
                            m(
                              'button.button[type=button]',
                              {
                                onclick: () => {
                                  vnode.attrs.actions.updateGroup(group);
                                },
                              },
                              'updateGroup'
                            ),
                            m(
                              'button.button[type=button]',
                              {
                                onclick: () => {
                                  vnode.attrs.actions.removeGroup(group);
                                },
                              },
                              'removeGroup'
                            ),
                          ]),
                        ]);
                      })
                    ),
                  ])
                ),
              ])
            )
          ),
          m(
            'li.no-padding',
            m(
              'ul.collapsible.collapsible-accordion',
              m('li', [
                m('a.collapsible-header', 'Layers', m('i.material-icons', 'arrow_drop_down')),
                m('div.collapsible-body', m('div', [])),
              ])
            )
          ),
          m('div.divider'),
          m('li', m('a.waves-effect', 'Chat', m('i.material-icons', 'chat'))),
        ]
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
