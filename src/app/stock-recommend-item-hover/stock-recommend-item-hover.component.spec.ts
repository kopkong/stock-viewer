import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRecommendItemHoverComponent } from './stock-recommend-item-hover.component';

describe('StockRecommendItemHoverComponent', () => {
  let component: StockRecommendItemHoverComponent;
  let fixture: ComponentFixture<StockRecommendItemHoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockRecommendItemHoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockRecommendItemHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
