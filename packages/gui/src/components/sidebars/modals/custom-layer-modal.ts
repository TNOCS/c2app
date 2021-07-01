import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';
// @ts-ignore
import car from '../../../assets/Operations/Car.png';
// @ts-ignore
import controlPoint from '../../../assets/Operations/Control point.png';
// @ts-ignore
import divisionCommand from '../../../assets/Operations/Division command.png';
// @ts-ignore
import evacuation from '../../../assets/Operations/Evacuation.png';
// @ts-ignore
import fireman from '../../../assets/Operations/Firemen unit.png';
// @ts-ignore
import helicopter from '../../../assets/Operations/Helicopter.png';
// @ts-ignore
import media from '../../../assets/Operations/Media.png';
// @ts-ignore
import sanitary from '../../../assets/Operations/Medical services.png';
// @ts-ignore
import military from '../../../assets/Operations/Military.png';
// @ts-ignore
import policeman from '../../../assets/Operations/Police unit.png';
// @ts-ignore
import roadBlock from '../../../assets/Operations/Road block.png';
// @ts-ignore
import truck from '../../../assets/Operations/Truck.png';
// @ts-ignore
import chemical from '../../../assets/Incidents/Chemical.png';
// @ts-ignore
import air from '../../../assets/Operations/air.png';
// @ts-ignore
import ground from '../../../assets/Operations/ground.png';

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
                m('option.left', { value: 'car', 'data-icon': car }, 'Car'),
                m('option.left', { value: 'controlPoint', 'data-icon': controlPoint }, 'Control Point'),
                m('option.left', { value: 'divisionCommand', 'data-icon': divisionCommand }, 'Division Command'),
                m('option.left', { value: 'evacuation', 'data-icon': evacuation }, 'Evacuation'),
                m('option.left', { value: 'fireman', 'data-icon': fireman }, 'Firefighter'),
                m('option.left', { value: 'roadBlock', 'data-icon': roadBlock }, 'Road Block'),
                m('option.left', { value: 'helicopter', 'data-icon': helicopter }, 'Helicopter'),
                m('option.left', { value: 'media', 'data-icon': media }, 'Media'),
                m('option.left', { value: 'medical', 'data-icon': sanitary }, 'Medical'),
                m('option.left', { value: 'military', 'data-icon': military }, 'Military'),
                m('option.left', { value: 'police', 'data-icon': policeman }, 'Police'),
                m('option.left', { value: 'truck', 'data-icon': truck }, 'Truck'),
                m('option.left', { value: 'chemical', 'data-icon': chemical }, 'Chemical Incident'),
                m('option.left', { value: 'air', 'data-icon': air }, 'UAV'),
                m('option.left', { value: 'ground', 'data-icon': ground }, 'UGV'),
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
                m('p.col.s9.offset-s1', 'Share this layer'),
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
