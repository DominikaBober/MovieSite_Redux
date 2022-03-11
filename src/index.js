import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/App/App';
import { Provider } from 'react-redux';
import {BrowserRouter} from "react-router-dom";
import store from './ducks/store'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
