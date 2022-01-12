import m from 'mithril';
import { MeiosisComponent } from '../../services/meiosis';
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

export const poiSidebar: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state, actions } }) => {
      const {
        app: { clickedFeature, sensorDict },
      } = state;
      return m(
        'ul#slide-out-2.sidenav.no-autoinit',
        m('.row', [
          m(
            'a.waves-effect.waves-teal.btn-flat',
            {
              onclick: () => {
                const elem = document.getElementById('slide-out-2') as HTMLElement;
                M.Sidenav.getInstance(elem).close();
                actions.resetClickedFeature();
              },
            },
            m('i.material-icons', 'clear')
          ),
          m('h5', 'Details'),
          // If there is a clicked feature
          m('.col.s12', [
            clickedFeature
              ? clickedFeature?.properties?.type === 'resource'
                ? m(resourceFormatComponent, { state, actions })
                : clickedFeature?.properties?.type === 'sensor'
                ? m(sensorFormatComponent, { state, actions })
                : clickedFeature?.properties?.type === 'context'
                ? m(contextFormatComponent, { state, actions })
                : clickedFeature?.properties?.type === 'plume'
                ? m(alertFormatComponent, { state, actions })
                : clickedFeature?.properties?.type === 'incidentLocation'
                ? m(incidentLocationFormatComponent, { state, actions })
                : clickedFeature?.properties?.type === 'MAN'
                ? formatMan(clickedFeature)
                : clickedFeature?.properties?.type === 'CAR'
                ? formatCar(clickedFeature)
                : clickedFeature?.properties?.type === 'FIREFIGHTER'
                ? formatMan(clickedFeature)
                : formatUnknown(clickedFeature)
              : // If there is no clicked feature
                m('p', ''),
          ]),
          m('p', sensorDict),
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
