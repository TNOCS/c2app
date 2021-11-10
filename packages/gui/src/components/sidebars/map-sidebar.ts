import m from 'mithril';
import { MeiosisComponent } from '../../services/meiosis';
import M from 'materialize-css';
import { gridModal, customLayerModal, createPOIModal, editLayerModal, editGroupModal } from './modals';
import { groupsBody, layersBody } from './bodies';

export const mapSideBar: MeiosisComponent = () => {
  return {
    view: ({ attrs: { state, actions } }) => {
      return [
        m(gridModal, { state, actions }),
        m(customLayerModal, { state, actions }),
        m(createPOIModal, { state, actions }),
        m(editLayerModal, { state, actions }),
        m(editGroupModal, { state, actions }),
        m('.col.l3.m4#slide-out.sidenav.sidenav-fixed', [
          /// GROUPS
          m('ul.collapsible', [
            m('li', [
              m('.collapsible-header', m('i.material-icons', 'group'), 'Groups'),
              m('.collapsible-body', m(groupsBody, { state, actions })),
            ]),
          ]),
          /// LAYERS
          m('ul.collapsible', [
            m('li', [
              m('.divider'),
              m('.collapsible-header', m('i.material-icons', 'layers'), 'Layers'),
              m('.collapsible-body', m(layersBody, { state, actions })),
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
