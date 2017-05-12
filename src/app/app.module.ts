import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
// import createLogger from 'redux-logger';
// import { rootReducer } from '../reducer/index';
import { HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import './rxjs-extension';

import { FixedFloatPipe } from '../pipe/fixed-float.pipe';
import { FixedPercenterPipe } from '../pipe/fixed-percent.pipe';

import { StockRecommendService } from '../service/stock-recommend.service';
import { StockCurrentService } from '../service/stock-current.service';
import { ConfigService } from '../service/config.service';

import { rootReducer , IAppState, INITIAL_STATE } from '../reducer/store';
import { AnalysisActions } from '../reducer/stock-analysis.action';
import { DataCacheService } from '../service/cache';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { StockComponent } from './stock/stock.component';
import { PageComponent } from '../common/page/page.component';
import { StockRecommendComponent } from './stock-recommend/stock-recommend.component';
import { StockSearchComponent } from './stock-search/stock-search.component';
import { CheckboxComponent } from '../common/checkbox/checkbox.component';
import { ButtonComponent } from '../common/button/button.component' ;

import { stockRecommendReducer } from '../reducer/stock-recommend';
import { IndexComponent } from './index/index.component';
import { StockDayService} from "../service/stock-day.service";
import { StockAnalysisService } from '../service/stock-analysis.service';
import { StockAnalysisComponent } from './stock-analysis/stock-analysis.component';
import { StockRecommendItemHoverComponent } from './stock-recommend-item-hover/stock-recommend-item-hover.component';
import { StockAnalysisDetailComponent } from './stock-analysis-detail/stock-analysis-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    StockComponent,
    PageComponent,
    StockRecommendComponent,
    StockSearchComponent,
    FixedFloatPipe,
    FixedPercenterPipe,
    CheckboxComponent,
    ButtonComponent,
    IndexComponent,
    StockAnalysisComponent,
    StockRecommendItemHoverComponent,
    StockAnalysisDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgReduxModule
  ],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    StockRecommendService, ConfigService, StockCurrentService, StockDayService, StockAnalysisService,
    AnalysisActions, DataCacheService],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(ngRedux: NgRedux<IAppState>) {
  //   ngRedux.configureStore(
  //     rootReducer,
  //     INITIAL_STATE
  //   )
  // }
}
