import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUserInfoComponent } from './set-user-info.component';

describe('SetUserInfoComponent', () => {
  let component: SetUserInfoComponent;
  let fixture: ComponentFixture<SetUserInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetUserInfoComponent]
    });
    fixture = TestBed.createComponent(SetUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
