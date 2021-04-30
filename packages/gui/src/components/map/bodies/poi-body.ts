import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../../services/meiosis';
import M from 'materialize-css';

export const poiBody: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m('div', [
        m('h5', 'Clicked POI'),
        m(
          'button.button[type=button]',
          {
            onclick: () => {
              vnode.attrs.actions.resetClickedFeature();
            },
          },
          'Clear clicked POI',
        ),
        m(
          'p',
          `${
            vnode.attrs.state.app.clickedFeature
              ? 'Type: ' +
              JSON.stringify(vnode.attrs.state.app.clickedFeature?.properties?.type) +
              ' Callsign: ' +
              JSON.stringify(vnode.attrs.state.app.clickedFeature?.properties?.name)
              : ''
          }`,
        ),
      ]);
    },
    oncreate: () => {
      M.AutoInit();
    },
  };
};
