import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';
import { editGroupModal } from './modals';
import { groupsBody } from './bodies';

export const chatSidebar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return [
        m(editGroupModal, { state: vnode.attrs.state, actions: vnode.attrs.actions }),
        m(
          'div.col.l3.m4#slide-out.sidenav.sidenav-fixed',
          {
            style: 'top: 64px; overflow-y: auto',
          },
          [
            /// GROUPS
            m('ul.collapsible', [
              m('li', [
                m('div.collapsible-header', m('i.material-icons', 'group'), 'Groups'),
                m('div.collapsible-body', m(groupsBody, { state: vnode.attrs.state, actions: vnode.attrs.actions })),
              ]),
            ]),
            // Fix the weird scroll clipping caused by
            m('div', { style: 'margin: 128px' }),
          ],
        ),
      ];
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
