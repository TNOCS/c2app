
import m, { FactoryComponent, route } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import M from 'materialize-css';
import { gridModal, customLayerModal, createPOIModal } from './modals';
import { groupsBody, layersBody, poiBody, messagesBody } from './bodies';

export const mapSideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return [
        m(gridModal, {state: vnode.attrs.state, actions: vnode.attrs.actions}),
        m(customLayerModal, {state: vnode.attrs.state, actions: vnode.attrs.actions}),
        m(createPOIModal, {state: vnode.attrs.state, actions: vnode.attrs.actions}),
        m(
          'ul.col.l3.m4#slide-out.sidenav.sidenav-fixed',
          {
            style: 'top: 64px; overflow-y: auto',
          },
          [
            /// Messages
            m(messagesBody, {state: vnode.attrs.state, actions: vnode.attrs.actions}),

            /// POIS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'POIs', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'add_location'),
                  ]),
                  m('div.collapsible-body', m(poiBody, {state: vnode.attrs.state, actions: vnode.attrs.actions})),
                ]),
              ),
            ),

            /// GROUPS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'Groups', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'group'),
                  ]),
                  m(
                    'div.collapsible-body',
                    m('div', m(groupsBody, {state: vnode.attrs.state, actions: vnode.attrs.actions})),
                  ),
                ]),
              ),
            ),

            /// LAYERS
            m(
              'li.no-padding',
              m(
                'ul.collapsible.collapsible-accordion',
                m('li', [
                  m('a.collapsible-header', 'Layers', [
                    m('i.material-icons', 'arrow_drop_down'),
                    m('i.material-icons', 'layers'),
                  ]),
                  m('div.collapsible-body', m('div', m(layersBody, {state: vnode.attrs.state, actions: vnode.attrs.actions})),
                  ),
                ]),
              ),
            ),

            /// LINKS
            m('div.divider'),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Map',
                  onclick: () => {
                    route.set('/mapbox');
                  },
                },
                m('i.material-icons', 'map'),
              ),
            ),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Chat',
                  onclick: () => {
                    route.set('/chat');
                  },
                },
                m('i.material-icons', 'chat'),
              ),
            ),
            m(
              'li',
              m(
                'a.waves-effect',
                {
                  text: 'Settings',
                  onclick: () => {
                    route.set('/settings');
                  },
                },
                m('i.material-icons', 'settings'),
              ),
            ),
            // Fix the weird scroll clipping caused by
            m('div', { style: 'margin: 128px' }),
          ],
        )]
        ;
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
