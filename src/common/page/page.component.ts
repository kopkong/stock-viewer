import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  pageTotal: Number;
  currentPage: Number;
  currentPages: Number[];

  constructor() {
    this.pageTotal = 10;
    this.currentPage = 1;
    this.currentPages = [1,2,3,4,5,6,7,8,9,10];
  }

  ngOnInit() {

  }

}
