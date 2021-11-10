import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';

export const Settings: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let setting: 'Icon Set' | 'No Setting Selected' = 'No Setting Selected';

  return {
    view: (_vnode) => {
      return m(
        '.col.s12',
        m('.col.s12.l5', [
          m('h4', 'Settings'),
          m(
            '.collection',
            m(
              'a.collection-item',
              {
                style: 'cursor: pointer;',
                onclick: () => {
                  setting = 'Icon Set';
                },
              },
              'Icon Set'
            )
          ),
        ]),
        m('.col.s12.l7', [
          setting === 'Icon Set'
            ? [
                m('h4', setting),
                m('.card-panel', [
                  m(
                    'p',
                    m('label', [
                      m('input', {
                        name: 'icons',
                        type: 'radio',
                        checked: true,
                      }),
                      m('span', 'Indigo'),
                    ])
                  ),
                  m(
                    'p',
                    m('label', [
                      m('input', {
                        name: 'icons',
                        type: 'radio',
                      }),
                      m('span', 'APP-6'),
                    ])
                  ),
                ]),
              ]
            : [m('h4', setting), m('.card-panel', [])],
        ])
      );
    },
  };
};
