import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { IGroup } from 'c2app-models-utils';

export const groupsBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'div',
        vnode.attrs.state.app.groups.length !== 0
          ? vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
              return m(
                'div.collection-item',
                m(
                  'label.row',
                  m('div.valign-wrapper', [
                    m('p.col.s7', 'ID: ' + index + ' Members: ' + group.callsigns.length),
                    m(
                      'a.btn.waves-effect.waves-light.col.s2.offset-s1.modal-trigger',
                      {
                        'data-target': 'editGroupModal',
                        onclick: () => {
                          vnode.attrs.actions.setGroupEdit(index);
                        },
                      },
                      m('i.material-icons', 'edit')
                    ),
                    m(
                      'a.btn.waves-effect.waves-light.red.col.s2',
                      {
                        onclick: () => {
                          vnode.attrs.actions.deleteGroup(group);
                        },
                      },
                      m('i.material-icons', 'delete')
                    ),
                  ])
                )
              );
            })
          : m('div', m('p', 'No groups'))
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
