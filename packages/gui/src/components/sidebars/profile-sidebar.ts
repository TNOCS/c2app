import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';

export const profileSidebar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'ul#slide-out-profile.sidenav.no-autoinit',
        {
          style: 'top: 64px; overflow-y: auto',
        },
        m('div.container', [
          m('a.waves-effect.waves-teal.btn-flat', {
            onclick: () => {
              const elem = document.getElementById('slide-out-profile') as HTMLElement;
              M.Sidenav.getInstance(elem).close();
            },
          }, m('i.material-icons', 'clear')),
          m('h5', 'Profile'),
          m('li', m('a.btn.waves-effect.waves-light.modal-trigger', {
            'data-target': 'profileModal',
          }, 'login')),
          m('div.card-panel', [
            m('li', m('p', `${vnode.attrs.state.app.profile ? 'Role: ' + vnode.attrs.state.app.profile : 'Role: No Profile'}`)),
            m('li', m('p', `${vnode.attrs.state.app.callsign ? 'Callsign: ' + vnode.attrs.state.app.callsign : 'Callsign: No Callsign'}`)),
          ]),
          m('div', { style: 'margin: 128px' }),
        ]),
      );
    },
    oncreate: () => {
      const elem = document.getElementById('slide-out-profile') as HTMLElement;
      M.Sidenav.init(elem, {
        edge: 'right',
        onOpenStart: function(elem: Element) {
          // @ts-ignore
          elem.M_Sidenav._overlay.remove();
        },
      });
    },
  };
};
