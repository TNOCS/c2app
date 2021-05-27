import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import { IAlert, IInfo } from '../../../../shared/src';

export const Alerts: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div.col.s12', [
        m('p', 'Alerts go here'),
        /// Messages
        m('div', [
          m('h5', 'Messages'),
          m('div.row', vnode.attrs.state.app.alerts.map((alert: IAlert) => {
            return m('p.col.s11.right', `${alert.identifier + ' ' + (alert.info as IInfo).urgency}`);
          })),
        ]),
      ]);
    },
  };
};
