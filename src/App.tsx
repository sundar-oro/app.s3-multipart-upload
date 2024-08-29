import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultPage from "./components";
import persistStore from "redux-persist/es/persistStore";
import { Provider } from "react-redux";
import { makeStore } from "./Redux";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  let persistor = persistStore(makeStore(false));

  return (
    <Provider store={makeStore(false)}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DefaultPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
