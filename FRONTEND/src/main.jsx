import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>,
);
