import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';

export const sideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (_vnode) => {
      return m(
        'ul.col.l3.m4#slide-out.sidenav.sidenav-fixed',
        {
          style: 'top: 64px; overflow-y: auto',
        },
        [
          // Fix the weird scroll clipping caused by
          m('div', { style: 'margin: 128px' }),
        ],
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
