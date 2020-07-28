import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupPageComponent } from './view-group-page.component';

describe('ViewGroupPageComponent', () => {
  let component: ViewGroupPageComponent;
  let fixture: ComponentFixture<ViewGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
