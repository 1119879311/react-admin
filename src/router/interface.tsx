export interface IRouter {
  name: string;
  key?: string | number;
  path?: string;
  title?: string | (() => string);
  Components?: any;
  exact?: boolean;
  children?: IRouter[];
  redirect?: string;
  [key: string]: any;
}
