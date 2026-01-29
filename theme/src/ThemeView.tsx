import { requireNativeView } from 'expo';
import * as React from 'react';

import { ThemeViewProps } from './Theme.types';

const NativeView: React.ComponentType<ThemeViewProps> =
  requireNativeView('Theme');

export default function ThemeView(props: ThemeViewProps) {
  return <NativeView {...props} />;
}
