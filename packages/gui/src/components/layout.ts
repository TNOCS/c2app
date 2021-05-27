import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../services/meiosis';
// @ts-ignore
import logo from 'url:../assets/explosion.svg';
import { profileModal } from './sidebars/modals';
import M from 'materialize-css';
import { poiSidebar } from './sidebars/poi-sidebar';

export const Layout: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('.main', [
        m(profileModal, { state: vnode.attrs.state, actions: vnode.attrs.actions }),
        m('ul.dropdown-content', {
          id: 'profile',
        }, [
          m('li', m('p', `${'Profile: ' + vnode.attrs.state.app.profile ? vnode.attrs.state.app.profile : 'No Profile'}`)),
          m('li', m('p', `${'Callsign: ' + vnode.attrs.state.app.callsign ? vnode.attrs.state.app.callsign : 'No Callsign'}`)),
          m('li', m('a.modal-trigger', {
            'data-target': 'profileModal'
          }, m('i.material-icons', 'edit'))),
        ]),
        m('.navbar',
          { style: 'z-index: 1001; height: 64px' },
          m('nav',
            { style: 'height:64px' },
            m('.nav-wrapper', [
              m('a.brand-logo', {
                onclick: () => {
                  m.route.set('/map');
                },
              }, [
                m(`img[width=100][height=45][src=${logo}].hide-on-med-and-down`, {
                  style: 'margin: 7px 0 0 5px;',
                }),
                m('div',
                  {
                    style: 'margin-top: 0px; position: absolute; top: 16px; left: 50px; width: 400px;',
                  },
                  m('h4.center.hide-on-med-and-down',
                    {
                      style: 'text-align: left; margin: -7px 0 0 60px; background: #01689B',
                    },
                    'SAFR',
                  ),
                ),
              ]),
              m(m.route.Link,
                {
                  class: 'sidenav-trigger',
                  'data-target': 'slide-out',
                  href: m.route.get(),
                },
                m('i.material-icons.hide-on-large-only', 'menu'),
              ),
              m('ul.right', [
                m('li',
                  m('a',
                    {
                      onclick: () => {
                        m.route.set('/alerts');
                      },
                    },
                    m('i.material-icons', 'warning'),
                  ),
                ),
                m('li',
                  m('a',
                    {
                      onclick: () => {
                        m.route.set('/map');
                      },
                    },
                    m('i.material-icons', 'map'),
                  ),
                ),
                m('li',
                  m('a',
                    {
                      onclick: () => {
                        m.route.set('/chat');
                      },
                    },
                    m('i.material-icons', 'chat'),
                  ),
                ),
                m('li',
                  m('a',
                    {
                      onclick: () => {
                        m.route.set('/settings');
                      },
                    },
                    m('i.material-icons', 'settings'),
                  ),
                ),
                m('li',
                  m('a.dropdown-trigger',
                    {
                      'data-target': 'profile',
                    }, m('i.material-icons', 'account_circle')),
                ),
              ]),
              m('a.right.sidenav-trigger.hide.no-autoinit',
                {
                  'data-target': 'slide-out-2',
                  href: m.route.get(),
                },
              ),
            ]),
          ),
        ),
        m('.row', vnode.children),
        m('.row', m(poiSidebar, { state: vnode.attrs.state, actions: vnode.attrs.actions }))
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
