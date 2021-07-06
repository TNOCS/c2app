import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';
import {
  formatMan,
  formatCar,
  alertFormatComponent,
  resourceFormatComponent,
  sensorFormatComponent,
  formatUnknown,
  incidentLocationFormatComponent,
  contextFormatComponent,
} from './poi-formatting';

export const poiSidebar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'ul#slide-out-2.sidenav.no-autoinit',
        {
          style: 'top: 64px; overflow-y: auto',
        },
        m('div.row', [
          m(
            'a.waves-effect.waves-teal.btn-flat',
            {
              onclick: () => {
                const elem = document.getElementById('slide-out-2') as HTMLElement;
                M.Sidenav.getInstance(elem).close();
                vnode.attrs.actions.resetClickedFeature();
              },
            },
            m('i.material-icons', 'clear')
          ),
          m('h5', 'Details'),
          // If there is a clicked feature
          m('div.col.s12', [
            vnode.attrs.state.app.clickedFeature
              ? vnode.attrs.state.app.clickedFeature?.properties?.type === 'resource'
                ? m(resourceFormatComponent, { state: vnode.attrs.state, actions: vnode.attrs.actions })
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'sensor'
                ? m(sensorFormatComponent, { state: vnode.attrs.state, actions: vnode.attrs.actions })
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'context'
                ? m(contextFormatComponent, { state: vnode.attrs.state, actions: vnode.attrs.actions })
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'incidentLocation'
                ? m(incidentLocationFormatComponent, { state: vnode.attrs.state, actions: vnode.attrs.actions })
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'man'
                ? formatMan(vnode.attrs.state.app.clickedFeature)
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'car'
                ? formatCar(vnode.attrs.state.app.clickedFeature)
                : vnode.attrs.state.app.clickedFeature?.properties?.type === 'firefighter'
                ? formatMan(vnode.attrs.state.app.clickedFeature)
                : vnode.attrs.state.app.clickedFeature?.properties?.time_of_validity
                ? m(alertFormatComponent, { state: vnode.attrs.state, actions: vnode.attrs.actions })
                : formatUnknown(vnode.attrs.state.app.clickedFeature)
              : // If there is no clicked feature
                m('p', ''),
          ]),
          m('p', vnode.attrs.state.app.sensorDict),
          m('div', { style: 'margin: 128px' }),
        ])
      );
    },
    oncreate: () => {
      const elem = document.getElementById('slide-out-2') as HTMLElement;
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
