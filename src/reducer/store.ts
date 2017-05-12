import { Action } from 'redux';
import { AnalysisActions } from './stock-analysis.action';
import { StockAnalysisService } from '../service/stock-analysis.service';

export interface IAppState {
  analysis: any;
}

export const INITIAL_STATE: IAppState = {
  analysis: new Map()
};

export function rootReducer(lastState: IAppState, action: Action): IAppState {
  console.log(action);
  switch(action.type) {
    case AnalysisActions.READ: return {
      analysis: lastState.analysis.set(1,'a')
    }
  }

  return lastState;
}


