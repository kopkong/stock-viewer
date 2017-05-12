import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAnalysisDetailComponent } from './stock-analysis-detail.component';

describe('StockAnalysisDetailComponent', () => {
  let component: StockAnalysisDetailComponent;
  let fixture: ComponentFixture<StockAnalysisDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAnalysisDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
