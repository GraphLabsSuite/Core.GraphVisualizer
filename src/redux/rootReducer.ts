import { combineReducers, Reducer } from 'redux';
import graphReducer from './graph/reducers';
import appReducer from './app/reducers';
import matrixReducer from './matrix/reducers';
import nGraphsReducer from './ngraphs/reducers';
import { IGraphView, IMatrixView, INGraphsView } from '..';
import {reducer as notifierReducer, INotifierStore } from 'graphlabs.core.notifier';
import { App } from './app';

export interface RootState {
  readonly graph: IGraphView;
  readonly matrix: IMatrixView;
  readonly ngraphs: INGraphsView;
  readonly notifier: INotifierStore;
  readonly app: App;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  graph: graphReducer,
  matrix: matrixReducer,
  ngraphs: nGraphsReducer,
  app: appReducer,
  notifier: notifierReducer
} as any);

export default rootReducer;
