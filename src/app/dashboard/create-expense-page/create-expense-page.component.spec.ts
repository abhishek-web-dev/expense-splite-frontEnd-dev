import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpensePageComponent } from './create-expense-page.component';

describe('CreateExpensePageComponent', () => {
  let component: CreateExpensePageComponent;
  let fixture: ComponentFixture<CreateExpensePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExpensePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpensePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
