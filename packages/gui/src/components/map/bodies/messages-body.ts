import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { IAlert } from '../../../../../shared/src';

export const messagesBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div', [
        m('h5', 'Messages'),
        m('div.row', vnode.attrs.state.app.alerts.map((alert: IAlert) => {
          return m('p.col.s11.right', alert.identifier);
        })),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
