
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app component
AppRegistry.registerComponent('App', () => App);

// Run the application using the standard AppRegistry method
// this ensures styles are correctly injected and the React root is properly managed
const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication('App', {
    initialProps: {},
    rootTag,
  });
}
