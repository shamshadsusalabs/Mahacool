import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccepetdCheckoutComponent } from './accepetd-checkout.component';

describe('AccepetdCheckoutComponent', () => {
  let component: AccepetdCheckoutComponent;
  let fixture: ComponentFixture<AccepetdCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccepetdCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccepetdCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
