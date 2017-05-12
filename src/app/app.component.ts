import { Component } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  observable$: Observable<{}>;

  title:string = 'app works!';

  today:string = new Date().toLocaleDateString();

  contentName: string = '股票数据管理';
}
