import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';

export const Settings: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (_vnode) => {
      return m('div.col.s12.l9.right', [m('p', 'Settings go here')]);
    },
  };
};
