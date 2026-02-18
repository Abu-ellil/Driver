import React from "react";
import { AppRegistry } from "react-native";
import App from "./App";

// Suppress harmless Material Icons warnings
// We use a clever technique where text with Material Icons font family
// gets converted to actual icon components. The warnings below are
// from the initial text rendering before conversion and are harmless.
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('is not a valid icon name for family "material"')
  ) {
    return; // Skip this warning
  }
  originalWarn.apply(console, args);
};

// Register both names to support Expo/Metro ("main") and web bootstrap ("App").
AppRegistry.registerComponent("main", () => App);
AppRegistry.registerComponent("App", () => App);

// Start the app if document exists
if (typeof document !== "undefined") {
  const rootTag = document.getElementById("root");
  if (rootTag) {
    AppRegistry.runApplication("main", { rootTag });
  }
}
