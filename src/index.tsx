import * as React from "react";
import { Provider } from "react-redux";
import App from "./components/App";
import { configureStore } from "./store/configuration"

export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
);