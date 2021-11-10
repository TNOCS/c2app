import m from 'mithril';
import { MeiosisComponent } from '../../services/meiosis';
import M from 'materialize-css';

export const profileSidebar: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state } }) => {
      const {
        app: { profile, callsign },
      } = state;
      return m(
        'ul#slide-out-profile.sidenav.no-autoinit',
        m('.container', [
          m(
            'a.waves-effect.waves-teal.btn-flat',
            {
              onclick: () => {
                const elem = document.getElementById('slide-out-profile') as HTMLElement;
                M.Sidenav.getInstance(elem).close();
              },
            },
            m('i.material-icons', 'clear')
          ),
          m('h5', 'Profile'),
          m(
            'li',
            m(
              'a.btn.waves-effect.waves-light.modal-trigger',
              {
                'data-target': 'profileModal',
              },
              'login'
            )
          ),
          m('.card-panel', [
            m('li', m('p', `${profile ? 'Role: ' + profile : 'Role: No Profile'}`)),
            m('li', m('p', `${callsign ? 'Callsign: ' + callsign : 'Callsign: No Callsign'}`)),
          ]),
          m('div', { style: 'margin: 128px' }),
        ])
      );
    },
    oncreate: () => {
      const elem = document.getElementById('slide-out-profile') as HTMLElement;
      M.Sidenav.init(elem, {
        edge: 'right',
        onOpenStart: function (elem: Element) {
          // @ts-ignore
          elem.M_Sidenav._overlay.remove();
        },
      });
    },
  };
};
