import * as React from 'react';

import { ThemeViewProps } from './Theme.types';

export default function ThemeView(props: ThemeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
