import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
import { Feature } from 'geojson';
import { IGroup } from '../../../services/meiosis';

export const groupsBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return [
        m('h5', 'Selected FRs'),
        [
          m(
            'button.button[type=button]',
            {
              onclick: () => {
                vnode.attrs.actions.resetSelectedFeatures();
              },
            },
            'Clear selected FRs',
          ),
          m(
            'button.button[type=button]',
            {
              onclick: () => {
                vnode.attrs.actions.createGroup();
              },
            },
            'Group selected FRs',
          ),
        ],
        m(
          'p',
          vnode.attrs.state.app.selectedFeatures?.features.map((feature: Feature) => {
            return m('span', JSON.stringify(feature.type));
          }),
        ),
        m('h5', 'Groups'),
        m(
          'p',
          vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
            return m('p', [
              m('p', 'ID: ' + index + ' Members: ' + group.callsigns.length, [
                m(
                  'button.button[type=button]',
                  {
                    onclick: () => {
                      vnode.attrs.actions.updateGroup(group);
                    },
                  },
                  'Update',
                ),
                m(
                  'button.button[type=button]',
                  {
                    onclick: () => {
                      vnode.attrs.actions.deleteGroup(group);
                    },
                  },
                  'Delete',
                ),
              ]),
            ]);
          }),
        ),
      ];
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
