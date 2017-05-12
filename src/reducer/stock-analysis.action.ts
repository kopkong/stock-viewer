import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class AnalysisActions {
  static READ = 'READ';

  read(date): Action {
    return { type: AnalysisActions.READ };
  }
}



