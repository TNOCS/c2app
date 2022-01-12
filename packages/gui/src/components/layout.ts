import m from 'mithril';
import { MeiosisComponent } from '../services/meiosis';
import logo from '../assets/safr.svg';
import { profileModal } from './sidebars/modals';
import M from 'materialize-css';
import { poiSidebar } from './sidebars/poi-sidebar';
import { profileSidebar } from './sidebars/profile-sidebar';
import { routingSvc } from '../services/routing-service';

export const Layout: MeiosisComponent = () => {
  return {
    view: ({ children, attrs: { state, actions } }) => {
      const { switchToPage } = actions;

      return m('.main', [
        m(profileModal, { state, actions }),
        m(
          '.navbar',
          // { style: 'z-index: 1001; height: 64px' },
          m(
            'nav',
            // { style: 'height:64px' },
            m('.nav-wrapper', [
              m(
                'a.brand-logo',
                {
                  onclick: () => {
                    m.route.set('/map');
                  },
                },
                [
                  m(`img[width=45][height=45][src=${logo}].hide-on-med-and-down`, {
                    style: 'margin: 7px 0 0 25px;',
                  }),
                  m(
                    'div',
                    {
                      style: 'margin-top: 0px; position: absolute; top: 16px; left: 50px; width: 400px;',
                    },
                    m(
                      'h4.center.hide-on-med-and-down',
                      {
                        style: 'text-align: left; margin: -7px 0 0 60px; background: #314443',
                      },
                      'SAFR'
                    )
                  ),
                ]
              ),
              m(
                m.route.Link,
                {
                  class: 'sidenav-trigger',
                  'data-target': 'slide-out',
                  href: m.route.get(),
                },
                m('i.material-icons.hide-on-large-only', 'menu')
              ),
              m('ul.right', [
                ...routingSvc
                  .getPages()
                  .filter((page) => page.visible)
                  .map((page) =>
                    m(
                      'li',
                      m(
                        'a',
                        { onclick: () => switchToPage(page.id) },
                        m(
                          'i.material-icons',
                          typeof page.icon === 'string' ? page.icon : page.icon ? page.icon() : undefined
                        )
                      )
                    )
                  ),
                m(
                  'li',
                  m(
                    'a',
                    {
                      onclick: () => {
                        const sideNavEl = document.getElementById('slide-out-profile') as HTMLElement;
                        if (!sideNavEl) return;
                        M.Sidenav.getInstance(sideNavEl).open();
                      },
                    },
                    m('i.material-icons', 'account_circle')
                  )
                ),
              ]),
            ])
          )
        ),
        m('.row', children),
        m('.row', m(poiSidebar, { state, actions })),
        m('.row', m(profileSidebar, { state, actions })),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
