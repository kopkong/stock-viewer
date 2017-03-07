import { StockRecommend } from '../model/stock-recommend';
import { ActionReducer, Action } from '@ngrx/store';

export const SET = 'SET';

export function stockRecommendReducer(state: StockRecommend = null, action: Action) {
  switch (action.type){
    case SET:
      state = action.payload;
      break;
    default:
      return state;
  }
}
