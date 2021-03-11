import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services';

export const sideBar: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'div',
        {
          style: `position: absolute; top: 64px; height: ${window.innerHeight - 64}; left: ${
            window.innerWidth - 250
          }; width: 250px;`,
        },
        [
          m('h2', 'Alerts'),
          m('span', vnode.attrs.state.app.alerts),
          m('h2', 'Clicked Feature'),
          m(
            'button.button[type=button]',
            {
              onclick: () => {
                vnode.attrs.actions.resetClickedFeature();
              },
            },
            'Reset clicked features'
          ),
          m('span', JSON.stringify(vnode.attrs.state.app.clickedFeature)),
          m('h2', 'Selected Features'),
          m(
            'button.button[type=button]',
            {
              onclick: () => {
                vnode.attrs.actions.resetSelectedFeatures();
              },
            },
            'Reset selected features'
          ),
          m('span', JSON.stringify(vnode.attrs.state.app.selectedFeatures)),
        ]
      );
    },
  };
};
