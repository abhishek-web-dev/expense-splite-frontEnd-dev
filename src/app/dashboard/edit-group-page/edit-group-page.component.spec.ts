import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupPageComponent } from './edit-group-page.component';

describe('EditGroupPageComponent', () => {
  let component: EditGroupPageComponent;
  let fixture: ComponentFixture<EditGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
