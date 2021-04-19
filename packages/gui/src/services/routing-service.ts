import m, { FactoryComponent, RouteDefs } from 'mithril';
import { actions, states, IAppModel } from './meiosis';
import { IPage } from '../models/page';
import { Layout } from '../components/layout';
import { Mapbox } from '../components/map/mapbox';
import { mapSideBar } from '../components/map/map-sidebar';
import { sideBar } from '../components/sidebar';
import { profileSelector } from '../components/profile-selector';
import { Chat } from '../components/chat/chat';
import { Settings } from '../components/settings/settings';

export enum Pages {
  PROFILE = 'PROFILE',
  MAPBOX = 'MAPBOX',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
}

class RoutingService {
  private pages!: ReadonlyArray<IPage>;

  constructor(private layout: FactoryComponent<{ state: IAppModel }>, pages: IPage[]) {
    this.setList(pages);
  }

  public getList() {
    return this.pages;
  }

  public setList(list: IPage[]) {
    this.pages = Object.freeze(list);
  }

  public get defaultRoute() {
    const page = this.pages.filter((p) => p.default).shift();
    return page ? page.route : this.pages[0].route;
  }

  public route(pageId: Pages) {
    const page = this.pages.filter((p) => p.id === pageId).shift();
    return page ? page.route : this.defaultRoute;
  }

  public switchTo(pageId: Pages, params?: { [key: string]: string | number | undefined }) {
    const page = this.pages.filter((p) => p.id === pageId).shift();
    if (page) {
      m.route.set(page.route, params ? params : undefined);
    }
  }

  public routingTable() {
    return this.pages.reduce((r, p) => {
      r[p.route] = p.hasSidebar
        ? {
            onmatch:
              p.id === Pages.PROFILE
                ? undefined
                : () => {
                    if (states().app.profile === '') m.route.set('/');
                  },
            render: () =>
              m(this.layout, { state: states() }, [
                m(p.sidebar, { state: states(), actions: actions }),
                m(p.component, { state: states(), actions: actions }),
              ]),
          }
        : {
            onmatch:
              p.id === Pages.PROFILE
                ? undefined
                : () => {
                    if (states().app.profile === '') m.route.set('/');
                  },
            render: () => m(this.layout, { state: states() }, m(p.component, { state: states(), actions: actions })),
          };
      return r;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService(Layout, [
  {
    id: Pages.PROFILE,
    title: 'Profile',
    icon: 'profile',
    route: '/',
    visible: true,
    component: profileSelector,
    sidebar: sideBar,
    hasSidebar: false,
  },
  {
    id: Pages.MAPBOX,
    title: 'Mapbox',
    icon: 'mapbox',
    route: '/mapbox',
    visible: true,
    component: Mapbox,
    sidebar: mapSideBar,
    hasSidebar: true,
  },
  {
    id: Pages.CHAT,
    title: 'Chat',
    icon: 'chat',
    route: '/chat',
    visible: true,
    component: Chat,
    sidebar: sideBar,
    hasSidebar: true,
  },
  {
    id: Pages.SETTINGS,
    title: 'Settings',
    icon: 'settings',
    route: '/settings',
    visible: true,
    component: Settings,
    sidebar: sideBar,
    hasSidebar: true,
  },
]);
