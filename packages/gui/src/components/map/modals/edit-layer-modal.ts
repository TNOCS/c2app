import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const editLayerModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div.modal.modal-fixed-footer', { id: 'editLayerModal' },
        m('div.modal-content', [
          m('h4', 'Edit Layer'),
          m('p', `${'layerId: ' + vnode.attrs.state.app.editLayer}`),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
            },
          }, 'Edit Layer'),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
