import m, { Vnode } from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/explosion.svg';
import { IPage } from '../models/Page';
import { routingSvc } from '../services/RoutingService';

const stripRouteParams = (path: string) => path.replace(/:[a-zA-Z]+/, '');

const isActiveRoute = (route = m.route.get()) => (path: string) =>
  path.length > 1 && route.indexOf(stripRouteParams(path)) >= 0
    ? '.active'
    : '';

export const Layout = () => ({
  view: (vnode: Vnode) => {
    const isActive = isActiveRoute();
    return m('.main', [
      m(
        '.navbar',
        { style: 'z-index: 1001' },
        m(
          'nav',
          m('.nav-wrapper', [
            m('a.brand-logo[href=#]', [
              m(`img[width=100][height=45][src=${logo}]`, {
                style: 'margin: 7px 0 0 5px;',
              }),
              m(
                'div',
                {
                  style:
                    'margin-top: 0px; position: absolute; top: 16px; left: 50px; width: 400px;',
                },
                m(
                  'h4.center.hide-on-med-and-down',
                  {
                    style:
                      'text-align: left; margin: -7px 0 0 60px; background: #01689B',
                  },
                  'C2 Application'
                )
              ),
            ]),
            m(m.route.Link,
              {
                className: 'sidenav-trigger',
                'data-target': 'slide-out',
                href: m.route.get(),
              },
              m(Icon, {
                iconName: 'menu',
                className: '.hide-on-med-and-up',
                style: 'margin-left: 5px;',
              })
            ),
            m('ul.right', [
              ...routingSvc
                .getList()
                .filter((p) => p.visible || isActive(p.route))
                .map((p: IPage) =>
                  m(
                    `li${isActive(p.route)}`,
                    m(
                      m.route.Link,
                      { href: p.route },
                      m(
                        'span',
                        p.icon
                          ? m(
                            'i.material-icons.white-text',
                            typeof p.icon === 'string' ? p.icon : p.icon()
                          )
                          : p.title
                      )
                    )
                  )
                ),
            ]),
          ])
        )
      ),
      m('.container', vnode.children),
    ]);
  },
});
