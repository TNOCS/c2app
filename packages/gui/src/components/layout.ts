import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../services/meiosis';
// @ts-ignore
import logo from '../assets/explosion.svg';
import { profileModal } from './sidebars/modals';
import M from 'materialize-css';
import { poiSidebar } from './sidebars/poi-sidebar';
import { profileSidebar } from './sidebars/profile-sidebar';

export const Layout: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('.main', [
        m(profileModal, { state: vnode.attrs.state, actions: vnode.attrs.actions }),
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
                  m('a',
                    {
                      onclick: () => {
                        const instance = M.Sidenav.getInstance(document.getElementById('slide-out-profile') as HTMLElement);
                        instance.open();
                      }
                    }, m('i.material-icons', 'account_circle')),
                ),
              ]),
            ]),
          ),
        ),
        m('.row', vnode.children),
        m('.row', m(poiSidebar, { state: vnode.attrs.state, actions: vnode.attrs.actions })),
        m('.row', m(profileSidebar, { state: vnode.attrs.state, actions: vnode.attrs.actions }))
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
