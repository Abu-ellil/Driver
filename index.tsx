import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app component
AppRegistry.registerComponent('App', () => App);

// Get the root element from the DOM
const rootElement = document.getElementById('root');

if (rootElement) {
  // Use getApplication to extract the component element and style element.
  // This is the most robust way to ensure styles are correctly injected in React 18/19 + RNW.
  // Fixed: Cast AppRegistry to any as getApplication is a react-native-web specific extension not present in standard RN types.
  const { element, getStyleElement } = (AppRegistry as any).getApplication('App', {
    initialProps: {},
  });

  const root = createRoot(rootElement);
  
  // Render the styles and the main element together in a fragment
  root.render(
    <React.Fragment>
      {getStyleElement()}
      {element}
    </React.Fragment>
  );
}