import m, { FactoryComponent } from 'mithril';
import { actions, IActions, IAppModel } from '../services/meiosis';
import { Button, Dropdown, TextInput } from 'mithril-materialized';

export const profileSelector: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div.col.s12', [
        m(TextInput, {
          label: 'Callsign',
          required: true,
          onchange: (v: string) => {
            actions.updateCallsign(v);
          },
        }),
        m(Dropdown, {
          class: `green col s12`,
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
          class: `green col s12`,
          label: 'Submit',
          onclick: () => {
            m.route.set('/mapbox');
          },
        }),
      ]);
    },
  };
};
