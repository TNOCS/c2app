import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const editGroupModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div.modal.modal-fixed-footer', { id: 'editGroupModal' },
        m('div.modal-content', [
          m('h4', 'Edit Group'),
          m('p', `${'groupId: ' + vnode.attrs.state.app.editGroup}`),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
            },
          }, 'Create Layer'),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
