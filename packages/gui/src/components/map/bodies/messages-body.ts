import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const messagesBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div', [
        m('h5', 'Messages'),
        m('div.row', vnode.attrs.state.app.alertLayers.map((layer: [string, boolean], index: number) => {
          return m('p.col.s11.right',
            m('label', [
              m('input', {
                type: 'checkbox',
                class: 'filled-in',
                checked: layer[1],
                onclick: () => {
                  vnode.attrs.actions.toggleLayer('alert', index);
                },
              }),
              m('span', layer[0])]),
          );
        })),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
