import m, { Vnode, FactoryComponent } from 'mithril';
import { actions, IActions, IAppModel } from '../services';
import { Button, Dropdown } from 'mithril-materialized';

export const profileSelector: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode: Vnode) => {
      return m('div.col.s12', [
        m(Dropdown, {
          items: [
            {
              label: 'commander',
            },
            {
              label: 'firefighter',
            },
          ],
          initialValue: vnode.attrs.state.app.profile,
          onchange: (v: string | number) => {
            actions.updateProfile(v.toString());
          },
        }),
        m(Button, {
          label: 'Submit',
          onclick: () => {
            m.route.set('/mapbox')
          },
        }),
      ]);
    },
  };
};
