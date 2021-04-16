import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../services/meiosis';

export const profileSelector: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let callsign: string;
  let profile: string;
  return {
    oncreate: () => {
      const elemSelect = document.querySelectorAll('select');
      M.FormSelect.init(elemSelect);
    },
    view: (vnode) => {
      return m(
        'div.col.s12',
        m('form.row', [
          m('div.input-field.col.s12.m4', [
            m('input', {
              id: 'callsign',
              type: 'text',
              value: callsign,
              onchange: (e: Event) => {
                const target = e.target as HTMLInputElement;
                callsign = target.value;
              },
            }),
            m(
              'label',
              {
                for: 'callsign',
              },
              'Callsign'
            ),
          ]),
          m('div.input-field.col.s12.m4', [
            m(
              'select',
              {
                onchange: (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  profile = target.value;
                },
              },
              [m('option', {value: '', disabled: true, selected: true}, 'Choose your profile'), m('option', { value: 'commander' }, 'commander'), m('option', { value: 'firefighter' }, 'firefighter')]
            ),
            m('label', 'Profile'),
          ]),
          m(
            'button.btn.waves-effect.waves-light.col.s12.m4',
            {
              onclick: () => {
                vnode.attrs.actions.updateCallsign(callsign);
                vnode.attrs.actions.updateProfile(profile);
                m.route.set('/mapbox');
              },
            },
            'Go',
            m('i.material-icons.right', 'send')
          ),
        ])
      );
    },
  };
};
