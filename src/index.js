import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { compose, createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import reducers from './components/data/reducers'

import { PersistGate } from 'redux-persist/es/integration/react'

const config = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(config, reducers)

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware // neat middleware that logs actions
  ))
)

let persistor = persistStore(store)

const onBeforeLift = () => {
  // take some action before the gate lifts
  console.log("beforeLift")
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={<div>Loading Pers Gate</div>}
      onBeforeLift={onBeforeLift}
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
