import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from './rootReducer';
import { init } from 'graphlabs.core.notifier';

init({
  protocol: 'http',
  host: 'gl-backend.svtz.ru',
  port: 5000,
  path: 'odata/taskVariantLogs'
});

export function configureStore(initialState?: RootState): Store<RootState> {
  const middlewares: Middleware[] = [
    thunk,
  ];
  const storeObject: Store<RootState> = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(...middlewares),
  ));
  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
      (module as any).hot.accept(['./graph'], () => {
      store.replaceReducer(rootReducer);
    });
  }
  return storeObject;
}

export const store: Store<RootState> = configureStore();
