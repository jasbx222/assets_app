export {};

declare global {

  interface RoutesType {
    name: string;
    layout: string;
    // icon: JSX.Element | string;
    path: string;
    secondary?: boolean | undefined;
  }
}
