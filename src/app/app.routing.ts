/**
 * Created by colin on 2016/12/9.
 */
import { NgModule }       from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StockRecommendComponent } from './stock-recommend/stock-recommend.component';
import { StockComponent } from './stock/stock.component';
import { StockAnalysisComponent } from './stock-analysis/stock-analysis.component';
import { StockAnalysisDetailComponent} from "./stock-analysis-detail/stock-analysis-detail.component";

const routes : Routes = [
  {
    path: 'stock-recommend',
    component: StockRecommendComponent
  },
  {
    path: 'stock-analysis',
    component: StockAnalysisComponent
  },
  {
    path: 'stock-analysis/:id',
    component: StockAnalysisDetailComponent
  },
  {
    path: 'stock/:id',
    component: StockComponent
  },
  {
    path: '',
    redirectTo: '/stock-recommend',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
