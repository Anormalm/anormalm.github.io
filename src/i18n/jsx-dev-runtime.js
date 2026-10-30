import { jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { translateProps } from './translator';
export { Fragment } from 'react/jsx-dev-runtime';
export const jsxDEV = (type, props, key, isStatic, source, self) => reactJsxDEV(type, translateProps(type, props), key, isStatic, source, self);
