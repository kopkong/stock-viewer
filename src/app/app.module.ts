import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import './rxjs-extension';

import { StockRecommendService } from '../service/stock-recommend.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { StockComponent } from './stock/stock.component';
import { PageComponent } from '../common/page/page.component';
import { StockRecommendComponent } from './stock-recommend/stock-recommend.component';
import { StockSearchComponent } from './stock-search/stock-search.component' ;

@NgModule({
  declarations: [
    AppComponent,
    StockComponent,
    PageComponent,
    StockRecommendComponent,
    StockSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [StockRecommendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
