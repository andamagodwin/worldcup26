import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import React from 'react';
import { Text } from 'react-native';

/** Faces handed to `useFonts` in the root layout. */
export const poppins = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
};

/**
 * Make Poppins the global default for every <Text> — including text rendered by
 * React Navigation (headers, tab labels) that we don't control. The base family
 * is prepended to the style array, so any weight-specific className
 * (font-p-bold, font-p-semibold, …) still wins.
 */
let patched = false;
export function applyPoppinsDefault() {
  if (patched) return;
  patched = true;
  const T = Text as unknown as { render: (...args: unknown[]) => React.ReactElement };
  const original = T.render;
  T.render = function render(...args: unknown[]) {
    const element = original.apply(this, args);
    return React.cloneElement(element, {
      style: [{ fontFamily: 'Poppins_400Regular' }, (element.props as { style?: unknown }).style],
    } as Partial<typeof element.props>);
  };
}
