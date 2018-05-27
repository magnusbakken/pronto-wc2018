import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoutComponent } from './knockout.component';

describe('KnockoutComponent', () => {
  let component: KnockoutComponent;
  let fixture: ComponentFixture<KnockoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnockoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
