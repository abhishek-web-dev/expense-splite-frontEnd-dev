import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpensePageComponent } from './edit-expense-page.component';

describe('EditExpensePageComponent', () => {
  let component: EditExpensePageComponent;
  let fixture: ComponentFixture<EditExpensePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExpensePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpensePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
