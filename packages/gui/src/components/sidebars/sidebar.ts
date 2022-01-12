import m from 'mithril';
import { MeiosisComponent } from '../../services/meiosis';
import M from 'materialize-css';

export const sideBar: MeiosisComponent = () => {
  return {
    view: () => {
      return m('ul.col.l3.m4#slide-out.sidenav.sidenav-fixed', [
        // Fix the weird scroll clipping caused by
        m('div', { style: 'margin: 128px' }),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
