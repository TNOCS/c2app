import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
// @ts-ignore
import car from '../../../assets/car_icon.png';
// @ts-ignore
import fireman from '../../../assets/fireman_icon.png';

export const customLayerModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let layerName: string;
  let icon: string;
  let share: boolean = false;
  return {
    view: (vnode) => {
      return m('div.modal.modal-fixed-footer', { id: 'customLayerModal' },
        m('div.modal-content', [
          m('h4', 'Create Layer'),
          m('row', [
            m('div.input-field.col.s6', [
              m('input', {
                id: 'layerName',
                type: 'text',
                value: layerName,
                onchange: (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  layerName = target.value;
                },
              }),
              m(
                'label',
                {
                  for: 'layerName',
                },
                'Layer Name',
              ),
            ]),
            m('div.input-field.col.s6', [
              m('select.icons', {
                  onchange: (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    icon = target.value;
                  },
                },
                m('option', { value: '', disabled: true, selected: true }, 'Choose the icon'),
                m('option.left', { value: 'fireman', 'data-icon': fireman }, 'Firefighter'),
                m('option.left', { value: 'car', 'data-icon': car }, 'Car'),
              ),
              m('label', 'Choose how this layer gets visualized'),
            ]),
            m('div.col.s6',
              m('div.valign-wrapper', [
                m('div.switch.col.s2',
                  m('label', [
                    m('input', {
                      type: 'checkbox',
                      class: 'filled-in',
                      checked: share,
                      onclick: () => {
                        share = !share;
                      },
                    }),
                    m('span.lever'),
                  ])),
                m('p.col.s10', 'Share this layer'),
              ]),
            ),
            m('div.input-field.col.s6', [
              m('select.multiple', {
                  id: 'sharewith',
                  multiple: true,
                },
                m('option', { value: '', disabled: true, selected: true }, 'Choose the roles'),
                m('option', { value: 'commander' }, 'Commanders'),
                m('option', { value: 'firefighter' }, 'Firefighters'),
                m('option', { value: 'medical' }, 'Medical Personnel'),
                m('option', { value: 'police' }, 'Police'),
              ),
              m('label', 'Choose with who this layer gets shared'),
            ]),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              vnode.attrs.actions.createCustomLayer(layerName, icon, share, M.FormSelect.getInstance(document.getElementById('sharewith') as HTMLElement).getSelectedValues());
            },
          }, 'Create Layer'),
        ),
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
