import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import './rxjs-extension';

import { FixedFloatPipe } from '../pipe/fixed-float.pipe';
import { FixedPercenterPipe } from '../pipe/fixed-percent.pipe';

import { StockRecommendService } from '../service/stock-recommend.service';
import { ConfigService } from '../service/config.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { StockComponent } from './stock/stock.component';
import { PageComponent } from '../common/page/page.component';
import { StockRecommendComponent } from './stock-recommend/stock-recommend.component';
import { StockSearchComponent } from './stock-search/stock-search.component';
import { CheckboxComponent } from '../common/checkbox/checkbox.component';
import { ButtonComponent } from '../common/button/button.component' ;


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
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    StockRecommendService, ConfigService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
