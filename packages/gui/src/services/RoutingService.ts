import m, { ComponentTypes, RouteDefs } from 'mithril';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Layout } from '../components/Layout';
import { Settings } from '../components/settings/Settings';
import { IPage } from '../models/Page';
//import { actions, states } from './';

export const enum Pages {
  HOME = 'HOME',
  SETTINGS = 'SETTINGS',
}

class RoutingService {
  //private actions = actions;
  //private states = states;
  private pages!: ReadonlyArray<IPage>;

  constructor(private layout: ComponentTypes, pages: IPage[]) {
    this.setList(pages);
  }

  public getList() {
    return this.pages;
  }

  public setList(list: IPage[]) {
    this.pages = Object.freeze(list);
  }

  public get defaultRoute() {
    const page = this.pages.filter(p => p.default).shift();
    return page ? page.route : this.pages[0].route;
  }

  public route(pageId: Pages) {
    const page = this.pages.filter(p => p.id === pageId).shift();
    return page ? page.route : this.defaultRoute;
  }

  public switchTo(
    pageId: Pages,
    params?: { [key: string]: string | number | undefined }
  ) {
    const page = this.pages.filter(p => p.id === pageId).shift();
    if (page) {
      m.route.set(page.route, params ? params : undefined);
    }
  }

  public routingTable() {
    return this.pages.reduce((r, p) => {
      r[p.route] =
        p.hasNavBar === false
          ? {
              render: () =>
                m(p.component/*, { state: this.states(), actions: this.actions }*/),
            }
          : {
              render: () =>
                m(
                  this.layout,
                  m(p.component/*, {
                    state: this.states(),
                    actions: this.actions,
                  }*/)
                ),
            };
      return r;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService(Layout, [
  {
    id: Pages.HOME,
    title: 'Home',
    icon: 'home',
    route: '/',
    visible: true,
    component: Dashboard,
  },
  {
    id: Pages.SETTINGS,
    title: 'Settings',
    icon: 'settings',
    route: '/settings',
    visible: true,
    component: Settings,
  },
]);
