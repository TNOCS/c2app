import m, { ComponentTypes, RouteDefs } from 'mithril';
import { Leaflet } from '../components/leaflet/Leaflet';
import { Layout } from '../components/Layout';
import { Mapbox } from '../components/mapbox/Mapbox';
import { IPage } from '../models/Page';
import { actions, states } from './';

export const enum Pages {
  LEAFLET = 'LEAFLET',
  MAPBOX = 'MAPBOX',
}

class RoutingService {
  private actions = actions;
  private states = states;
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
              m(p.component, { state: this.states(), actions: this.actions }),
          }
          : {
            render: () =>
              m(
                this.layout,
                m(p.component, { state: this.states(), actions: this.actions })
              ),
          };
      return r;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService(Layout, [
  {
    id: Pages.LEAFLET,
    title: 'Leaflet',
    icon: 'leaflet',
    route: '/leaflet',
    visible: true,
    component: Leaflet,
  },
  {
    id: Pages.MAPBOX,
    title: 'Mapbox',
    icon: 'mapbox',
    route: '/mapbox',
    visible: true,
    component: Mapbox,
  },
]);
