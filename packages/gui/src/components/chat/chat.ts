import m, { FactoryComponent } from 'mithril';
import { IActions, IAppModel } from '../../services/meiosis';
import { IGroup, IMessage } from 'c2app-models-utils';

export const Chat: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  let input: string;
  return {
    view: (vnode) => {
      return m(
        'div.col.s12.l9.right',
        m('div.col.s12.l5', [
          m('h4', 'Chats'),
          m(
            'div.collection',
            vnode.attrs.state.app.groups.length > 0
              ? vnode.attrs.state.app.groups?.map((group: IGroup, index: number) => {
                  return m(
                    'a.collection-item',
                    {
                      style: 'cursor: pointer;',
                      onclick: () => {
                        vnode.attrs.actions.openChat(group);
                      },
                    },
                    'ID: ' + index + ' Members: ' + group.callsigns.length,
                    m(
                      'span',
                      { class: 'new badge' },
                      vnode.attrs.state.app.newMessages || vnode.attrs.state.app.chat?.id === group.id
                        ? vnode.attrs.state.app.newMessages[group.id]
                        : 0
                    )
                  );
                })
              : [m('a.collection-item', 'No Groups')]
          ),
        ]),
        m('div.col.s12.l7', [
          vnode.attrs.state.app.chat
            ? [
                m('h4', vnode.attrs.state.app.chat.name),
                m('div.card-panel', [
                  m(
                    'div',
                    vnode.attrs.state.app.messages.get(vnode.attrs.state.app.chat.id)?.map((message: IMessage) => {
                      return m(
                        'div',
                        `${
                          message.sender === vnode.attrs.state.app.callsign
                            ? 'You: ' + message.message
                            : message.sender + ': ' + message.message
                        }`
                      );
                    })
                  ),
                ]),
                m(
                  'form.row',
                  m('div.valign-wrapper', [
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
                        'Message'
                      ),
                    ]),
                    m(
                      'button.btn.waves-effect.waves-light.col.s3',
                      {
                        onclick: (e: Event) => {
                          e.preventDefault();
                          vnode.attrs.actions.sendChat(vnode.attrs.state.app.chat as IGroup, input);
                          input = '';
                        },
                      },
                      'Send',
                      m('i.material-icons.right', 'send')
                    ),
                  ])
                ),
              ]
            : [
                m('h4', 'No chat selected'),
                m('div.card-panel', ''),
                m(
                  'form.row',
                  m('div.valign-wrapper', [
                    m('div.input-field.col.s9', [
                      m('input', {
                        id: 'dummy',
                        type: 'text',
                        disabled: 'true',
                      }),
                      m(
                        'label',
                        {
                          for: 'dummy',
                        },
                        'Message'
                      ),
                    ]),
                    m(
                      'button.btn.waves-effect.waves-light.col.s3',
                      {
                        disabled: true,
                      },
                      'Send',
                      m('i.material-icons.right', 'send')
                    ),
                  ])
                ),
              ],
        ])
      );
    },
  };
};
