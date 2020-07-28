import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpensePageComponent } from './view-expense-page.component';

describe('ViewExpensePageComponent', () => {
  let component: ViewExpensePageComponent;
  let fixture: ComponentFixture<ViewExpensePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExpensePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpensePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
