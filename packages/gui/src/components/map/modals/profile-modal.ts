import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const profileModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let callsign: string;
  let profile: string;
  return {
    view: (vnode) => {
      return m('div.modal.modal-fixed-footer', { id: 'profileModal' },
        m('div.modal-content', [
          m('h4', 'Login'),
          m('form.row', {
            onsubmit: function(e: Event) {
              e.preventDefault();
            },
          }, [
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
                'Callsign',
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
                [
                  m('option', { value: '', disabled: true, selected: true }, 'Choose your profile'),
                  m('option', { value: 'commander' }, 'commander'),
                  m('option', { value: 'firefighter' }, 'firefighter'),
                ],
              ),
              m('label', 'Profile'),
            ]),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              vnode.attrs.actions.updateCallsign(callsign);
              vnode.attrs.actions.updateProfile(profile);
            },
          }, 'Login'),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
