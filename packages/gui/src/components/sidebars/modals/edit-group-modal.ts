import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const editGroupModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let editName: string;

  return {
    view: (vnode) => {
      return m(
        '.modal.modal-fixed-footer',
        { id: 'editGroupModal' },
        m('.modal-content', [
          m('div', [
            m('p', 'Creates a group of the selected First Responders listed below'),
            m('.input-field.col.s4', [
              m('input', {
                id: 'editName',
                type: 'text',
                value: editName,
                onchange: (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  editName = target.value;
                },
              }),
              m(
                'label',
                {
                  for: 'editName',
                },
                'Group Name'
              ),
            ]),
            m('.col.s4'),
            m('.col.s4'),
          ]),
        ]),
        m(
          '.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m(
            'a.modal-close.waves-effect.waves-green.btn-flat',
            {
              onclick: () => {
                vnode.attrs.actions.updateGroup(vnode.attrs.state.app.editGroup, editName);
              },
            },
            'Edit Group'
          )
        )
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
