import { ComponentTypes } from 'mithril';

export type IconType = () => string | string;

type IconResolver = () => string;
type IconOrResolver = string | IconResolver;

export interface IPage {
  id: string;
  default?: boolean;
  hasNavBar?: boolean;
  title: string;
  icon?: IconOrResolver;
  route: string;
  visible: boolean;
  component: ComponentTypes<any, any>;
  sidebar: ComponentTypes<any, any>;
}
