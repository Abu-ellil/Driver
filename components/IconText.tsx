import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import type { TextProps, TextStyle } from 'react-native';

type MaterialIconName = any;

const extractIconName = (children: React.ReactNode): MaterialIconName | null => {
  const parts: string[] = [];

  for (const child of React.Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      const value = String(child).trim();
      if (value) {
        parts.push(value);
      }
      continue;
    }

    return null;
  }

  if (parts.length !== 1) return null;

  return parts[0];
};

const Text: React.FC<TextProps> = ({ style, children, ...rest }) => {
  const flatStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const fontFamily = typeof flatStyle?.fontFamily === 'string' ? flatStyle.fontFamily.toLowerCase() : '';
  const shouldRenderAsIcon = fontFamily.includes('material icons');

  // Just render as text - let the font ligatures do their job
  // This works for both web and native when using Material Icons font
  return (
    <RNText {...rest} style={style}>
      {children}
    </RNText>
  );
};

export default Text;
