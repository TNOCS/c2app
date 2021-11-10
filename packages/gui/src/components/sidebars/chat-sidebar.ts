import m from 'mithril';
import { MeiosisComponent } from '../../services/meiosis';
import M from 'materialize-css';
import { editGroupModal } from './modals';
import { groupsBody } from './bodies';

export const chatSidebar: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state, actions } }) => {
      return [
        m(editGroupModal, { state, actions }),
        m('.col.l3.m4#slide-out.sidenav.sidenav-fixed', [
          /// GROUPS
          m('ul.collapsible', [
            m('li', [
              m('.collapsible-header', m('i.material-icons', 'group'), 'Groups'),
              m('.collapsible-body', m(groupsBody, { state, actions })),
            ]),
          ]),
          // Fix the weird scroll clipping caused by
          m('div', { style: 'margin: 128px' }),
        ]),
      ];
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
