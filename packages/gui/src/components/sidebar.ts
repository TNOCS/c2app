import m, { FactoryComponent, route } from 'mithril';
import { IActions, IAppModel } from '../services/meiosis';
import M from 'materialize-css'

export const sideBar: FactoryComponent<{
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
                m('a.collapsible-header', 'Dropdown', [
                  m('i.material-icons', 'arrow_drop_down'),
                  m('i.material-icons', 'add_location'),
                ]),
                m(
                  'div.collapsible-body',
                  m('div', [m('p', 'dropdown content')])
                ),
              ])
            )
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
              m('i.material-icons', 'map')
            )
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
              m('i.material-icons', 'chat')
            )
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
              m('i.material-icons', 'settings')
            )
          ),
          // Fix the weird scroll clipping caused by
          m('div', {style: 'margin: 128px'})
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
