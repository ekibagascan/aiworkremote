import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import reducers from "./reducers";
import "./index.css";
import App from "./App";

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

const paypalOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

ReactDOM.render(
  <Provider store={store}>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  </Provider>,
  document.getElementById("root")
);
