// Reexport the native module. On web, it will be resolved to ThemeModule.web.ts
// and on native platforms to ThemeModule.ts
export { default } from './ThemeModule';
export { default as ThemeView } from './ThemeView';
export * from  './Theme.types';
