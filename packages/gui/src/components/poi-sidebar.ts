import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../services/meiosis';
import M from 'materialize-css';

export const poiSidebar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'ul#slide-out-2.sidenav',
        {
          style: 'top: 64px; overflow-y: auto',
        },
        m('div.container', [
          m('a.waves-effect.waves-teal.btn-flat', {
            onclick: () => {
              const elem = document.getElementById('slide-out-2') as HTMLElement;
              M.Sidenav.getInstance(elem).close();
            },
          }, m('i.material-icons', 'clear')),
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
          // Fix the weird scroll clipping caused by
          m('div', { style: 'margin: 128px' }),
        ]),
      );
    },
    oncreate: () => {
      const elem = document.getElementById('slide-out-2') as HTMLElement;
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
