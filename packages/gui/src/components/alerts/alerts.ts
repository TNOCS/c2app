import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import { IAlert, IInfo } from 'c2app-models-utils';

export const Alerts: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('.col.s12', [
        m('.col.s12.l5', [
          m('h4', 'Alerts'),
          m(
            '.collection',
            vnode.attrs.state.app.alerts.length > 0
              ? vnode.attrs.state.app.alerts?.map((alert: IAlert, index: number) => {
                  return m(
                    'a.collection-item',
                    {
                      style: 'cursor: pointer;',
                      onclick: () => {
                        vnode.attrs.actions.openAlert(alert);
                      },
                    },
                    'ID: ' + index + ' Members: ' + alert.identifier
                  );
                })
              : [m('a.collection-item', 'No Alerts')]
          ),
        ]),
        m('.col.s12.l7', [
          vnode.attrs.state.app.alert
            ? [
                m('h4', vnode.attrs.state.app.alert.identifier),
                m('.card-panel', [
                  m('p', `${'Sender: ' + vnode.attrs.state.app.alert.sender}`),
                  m('p', `${'Status: ' + vnode.attrs.state.app.alert.status}`),
                  m('p', `${'Type: ' + vnode.attrs.state.app.alert.msgType}`),
                  m('p', `${'Scope: ' + vnode.attrs.state.app.alert.scope}`),
                  m('p', `${'Category: ' + (vnode.attrs.state.app.alert.info as IInfo).category}`),
                  m('p', `${'Event: ' + (vnode.attrs.state.app.alert.info as IInfo).event}`),
                  m('p', `${'Urgency: ' + (vnode.attrs.state.app.alert.info as IInfo).urgency}`),
                  m('p', `${'Severity: ' + (vnode.attrs.state.app.alert.info as IInfo).severity}`),
                  m('p', `${'Certainty: ' + (vnode.attrs.state.app.alert.info as IInfo).certainty}`),
                ]),
              ]
            : [m('h4', 'No alert selected'), m('.card-panel', '')],
        ]),
      ]);
    },
  };
};
