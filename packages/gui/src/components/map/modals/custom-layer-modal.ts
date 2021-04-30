import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const customLayerModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let layerName: string;
  let addCurrentDrawings: boolean;
  return {
    view: (vnode) => {
      return m('div.modal.modal-fixed-footer', { id: 'customLayerModal' },
        m('div.modal-content', [
          m('h4', 'Create Layer'),
          m('row', [
            m('div.input-field.col.s12', [
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
            m('p.col.s12',
              m('label', [
                m('input', {
                  type: 'checkbox',
                  class: 'filled-in',
                  checked: addCurrentDrawings,
                  onclick: () => {
                    addCurrentDrawings = !addCurrentDrawings;
                  },
                }),
                m('span', 'Add Current POIs')]),
            ),
          ]),
        ]),
        m('div.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m('a.modal-close.waves-effect.waves-green.btn-flat', {
            onclick: () => {
              vnode.attrs.actions.updateCustomLayers(layerName, addCurrentDrawings);
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
