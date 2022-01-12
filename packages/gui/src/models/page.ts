import { ComponentTypes } from 'mithril';

type IconResolver = () => string;
type IconOrResolver = string | IconResolver;

export enum Pages {
  MAP = 'MAP',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
  ALERTS = 'ALERTS',
}

export interface IPage {
  id: Pages;
  default?: boolean;
  hasNavBar?: boolean;
  title: string;
  icon?: IconOrResolver;
  route: string;
  visible: boolean;
  component: ComponentTypes<any, any>;
  sidebar: ComponentTypes<any, any>;
  hasSidebar: boolean;
}
