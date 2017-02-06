import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss']
})
export class StockSearchComponent implements OnInit {

  @Input()
  filters: string[];

  constructor() { }

  ngOnInit() {
  }

}
