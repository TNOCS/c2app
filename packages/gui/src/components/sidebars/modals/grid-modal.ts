import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const gridModal: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let gridCellSize: string;
  let updateLocation: boolean = false;
  return {
    view: (vnode) => {
      return m(
        '.modal.modal-fixed-footer',
        { id: 'gridModal' },
        m('.modal-content', [
          m('h4', 'Create Grid'),
          m('row', [
            m('.input-field.col.s12', [
              m('input', {
                id: 'gridCellSize',
                type: 'text',
                value: gridCellSize,
                onchange: (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  gridCellSize = target.value;
                },
              }),
              m(
                'label',
                {
                  for: 'gridCellSize',
                },
                'Cell Size (km)'
              ),
            ]),
            m(
              '.col.s6',
              m('.valign-wrapper', [
                m(
                  '.switch.col.s2',
                  m('label', [
                    m('input', {
                      type: 'checkbox',
                      class: 'filled-in',
                      checked: updateLocation,
                      onclick: () => {
                        updateLocation = !updateLocation;
                      },
                    }),
                    m('span.lever'),
                  ])
                ),
                m('p.col.s10', 'Fit Grid to Current Viewport'),
              ])
            ),
          ]),
        ]),
        m(
          '.modal-footer',
          m('a.modal-close.waves-effect.waves-green.btn-flat', 'Cancel'),
          m(
            'a.modal-close.waves-effect.waves-green.btn-flat',
            {
              onclick: () => {
                vnode.attrs.actions.updateGridOptions(Number(gridCellSize), updateLocation);
              },
            },
            'Create Grid'
          )
        )
      );
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
