import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutLoginPageComponent } from './layout-login-page.component';

describe('LayoutLoginPageComponent', () => {
  let component: LayoutLoginPageComponent;
  let fixture: ComponentFixture<LayoutLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
