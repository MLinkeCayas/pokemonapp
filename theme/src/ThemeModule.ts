import { NativeModule, requireNativeModule } from 'expo';

import { ThemeModuleEvents } from './Theme.types';

declare class ThemeModule extends NativeModule<ThemeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ThemeModule>('Theme');
