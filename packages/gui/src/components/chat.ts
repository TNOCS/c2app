import m, { FactoryComponent } from 'mithril';
import { TextInput } from 'mithril-materialized';
import { IActions, IAppModel, IGroup } from '../services/meiosis';

export const Chat: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: (vnode) => {
      return m(
        'div.col.s12.l9.right',
        m('div.col.s12.l4', [
          m(
            'p',
            vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
              return m('p', [
                m('p', 'ID: ' + index + ' Members: ' + group.callsigns.length, [
                  m(
                    'button.button[type=button]',
                    {
                      onclick: () => {
                        vnode.attrs.actions.openChat(group);
                      },
                    },
                    'Open'
                  ),
                  m(
                    'button.button[type=button]',
                    {
                      onclick: () => {
                        vnode.attrs.actions.closeChat();
                      },
                    },
                    'Close'
                  ),
                ]),
              ]);
            })
          ),
        ]),
        m('div.col.s12.l5', [
          vnode.attrs.state.app.chat
            ? m('div', [m('p', vnode.attrs.state.app.chat.id), m(TextInput, 'Message'), m(
              'button.button[type=button]',
              {
                onclick: () => {
                  vnode.attrs.actions.sendChat(vnode.attrs.state.app.chat as IGroup, "TestMessage");
                },
              },
              'Send'
            ),])
            : m('p', 'No chat selected!'),
        ])
      );
    },
  };
};
