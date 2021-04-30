import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel, IGroup, IMessage } from '../../services/meiosis';

export const Chat: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let input: string;
  return {
    view: (vnode) => {
      return m(
        'div.col.s12.l9.right',
        m('div.col.s12.l4', [
          m(
            'div.collection',
            vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
              return m(
                'a.collection-item',
                {
                  style: 'cursor: pointer;',
                  onclick: () => {
                    vnode.attrs.actions.openChat(group);
                  },
                },
                'ID: ' + index + ' Members: ' + group.callsigns.length,
                m('span', { class: 'new badge' }, '4'),
              );
            }),
          ),
        ]),
        m('div.col.s12.l5', [
          vnode.attrs.state.app.chat
            ? m('div', [
              m('p', vnode.attrs.state.app.chat.id),
              m('div', [
                m(
                  'div',
                  vnode.attrs.state.app.messages.get(vnode.attrs.state.app.chat.id)?.map((message: IMessage) => {
                    return m(
                      'div',
                      `${
                        message.sender === vnode.attrs.state.app.callsign
                          ? 'You: ' + message.message
                          : message.sender + ': ' + message.message
                      }`,
                    );
                  }),
                ),
              ]),
              m('form.row', [
                m('div.input-field.col.s9', [
                  m('input', {
                    id: 'message',
                    type: 'text',
                    value: input,
                    onchange: (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      input = target.value;
                    },
                  }),
                  m(
                    'label',
                    {
                      for: 'message',
                    },
                    'Message',
                  ),
                ]),
                m(
                  'button.btn.waves-effect.waves-light.col.s3',
                  {
                    onclick: () => {
                      vnode.attrs.actions.sendChat(vnode.attrs.state.app.chat as IGroup, input);
                      input = '';
                    },
                  },
                  'Send',
                  m('i.material-icons.right', 'send'),
                ),
              ]),
            ])
            : m('p', 'No chat selected!'),
        ]),
      );
    },
  };
};
