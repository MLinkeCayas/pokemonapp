import { registerWebModule, NativeModule } from 'expo';

import { ThemeModuleEvents } from './Theme.types';

class ThemeModule extends NativeModule<ThemeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ThemeModule, 'ThemeModule');
