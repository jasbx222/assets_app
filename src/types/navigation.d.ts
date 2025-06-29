import { ComponentType, Element } from 'react';

export interface IRoute {
  name: string;
  layout: string;
  items?: any;
  path: string;
  secondary?: boolean | undefined;
}
interface RoutesType {
  name: string;
  layout: string;
  path: string;
  secondary?: boolean | undefined;
}
