import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import './rxjs-extension';

import { FixedFloatPipe } from '../pipe/fixed-float.pipe';
import { FixedPercenterPipe } from '../pipe/fixed-percent.pipe';

import { StockRecommendService } from '../service/stock-recommend.service';
import { StockCurrentService } from '../service/stock-current.service';
import { ConfigService } from '../service/config.service';


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
import {StockDayService} from "../service/stock-day.service";


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
    IndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    StoreModule.provideStore({ stockRecommend: stockRecommendReducer})
  ],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    StockRecommendService, ConfigService, StockCurrentService, StockDayService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
