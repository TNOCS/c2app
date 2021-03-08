import m, { Vnode } from 'mithril';
import logo from '../assets/explosion.svg';
import { IPage } from '../models/page';
import { routingSvc } from '../services/routing-service';

const stripRouteParams = (path: string) => path.replace(/:[a-zA-Z]+/, '');

const isActiveRoute = (route = m.route.get()) => (path: string) =>
  path.length > 1 && route.indexOf(stripRouteParams(path)) >= 0 ? '.active' : '';

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
                  style: 'margin-top: 0px; position: absolute; top: 16px; left: 50px; width: 400px;',
                },
                m(
                  'h4.center.hide-on-med-and-down',
                  {
                    style: 'text-align: left; margin: -7px 0 0 60px; background: #01689B',
                  },
                  'C2 Application'
                )
              ),
            ]),
            m('ul.right', [
              ...routingSvc
                .getList()
                .filter((p) => p.visible || isActive(p.route))
                .map((p: IPage) => m(`li${isActive(p.route)}`, m(m.route.Link, { href: p.route }, m('span', p.title)))),
            ]),
          ])
        )
      ),
      m('.container', vnode.children),
    ]);
  },
});
