
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the application
AppRegistry.registerComponent('App', () => App);

const rootElement = document.getElementById('root');

if (rootElement) {
  // Use getApplication to prepare the app and styles
  const { element, getStyleElement } = (AppRegistry as any).getApplication('App');
  
  const root = createRoot(rootElement);
  
  // Render the styles and the app element. 
  // In React 19, we render them as a flat array or simple fragment to ensure stability.
  root.render(
    <React.Fragment>
      {getStyleElement()}
      {element}
    </React.Fragment>
  );
}
